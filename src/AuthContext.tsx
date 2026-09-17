import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { AlertTriangle, X, Copy, Check } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signInWithEmail: async () => {},
  logOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<{ type: string; message: string } | null>(null);
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              name: currentUser.displayName || currentUser.email,
              email: currentUser.email,
              createdAt: new Date().toISOString(),
            }, { merge: true });
          }
        } catch (err: any) {
          if (err?.code === 'permission-denied') {
            console.warn("Firestore permissions not set up yet. Prompting user with rules.", err.message);
            setAuthError({
              type: 'permission-denied',
              message: 'Firestore security rules are blocking access.'
            });
          } else {
            console.error("Error saving user to Firestore:", err);
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setAuthError(null);
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Error signing in', error);
      if (error && error.code === 'auth/unauthorized-domain') {
        setAuthError({
          type: 'unauthorized-domain',
          message: 'This preview domain is not authorized in your Firebase project.'
        });
      } else {
        setAuthError({
          type: 'general',
          message: error instanceof Error ? error.message : 'An error occurred during sign in.'
        });
      }
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      setAuthError(null);
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error('Error signing in with email', error);
      if (error?.code === 'auth/invalid-credential' || error?.code === 'auth/user-not-found' || error?.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password.');
      }
      if (error?.code === 'auth/operation-not-allowed') {
        throw new Error('Email/Password sign-in is not enabled in Firebase Console.');
      }
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
      throw error;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDomain(text);
    setTimeout(() => setCopiedDomain(null), 2000);
  };

  const domainsToWhitelist = [
    'ais-dev-btofq7lwp7ifn4lo522owj-678128702441.asia-east1.run.app',
    'ais-pre-btofq7lwp7ifn4lo522owj-678128702441.asia-east1.run.app'
  ];

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logOut }}>
      {children}
      
      {authError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-red-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {authError.type === 'unauthorized-domain' 
                    ? 'Domain Not Authorized' 
                    : authError.type === 'permission-denied'
                      ? 'Firestore Permission Denied'
                      : 'Sign In Failed'}
                </h3>
              </div>
              <button 
                onClick={() => setAuthError(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {authError.type === 'unauthorized-domain' ? (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Because you are using your own Firebase configuration, you must authorize this AI Studio preview domain in your Firebase console before sign-in will work.
                  </p>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900">Add these domains to Firebase:</h4>
                    <ul className="space-y-2">
                      {domainsToWhitelist.map(domain => (
                        <li key={domain} className="flex items-center justify-between bg-white border border-gray-100 p-2 rounded text-xs font-mono text-gray-700 shadow-sm">
                          <span className="truncate pr-2">{domain}</span>
                          <button 
                            onClick={() => copyToClipboard(domain)}
                            className="text-amber-600 hover:text-amber-700 flex-shrink-0"
                            title="Copy to clipboard"
                          >
                            {copiedDomain === domain ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="text-sm text-gray-600 pt-2 border-t border-gray-100">
                    <p className="font-semibold text-gray-900 mb-1">How to fix:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-amber-600 hover:underline">Firebase Console</a></li>
                      <li>Select your project (<code className="bg-gray-100 px-1 py-0.5 rounded text-xs">agritrade-d4f49</code>)</li>
                      <li>Go to <strong>Authentication</strong> &gt; <strong>Settings</strong> &gt; <strong>Authorized domains</strong></li>
                      <li>Click <strong>Add domain</strong> and paste the domains above</li>
                    </ol>
                  </div>
                </div>
              ) : authError.type === 'permission-denied' ? (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Because you are using your own Firebase configuration, you must deploy Firestore Security Rules to allow the app to save your user profile and orders.
                  </p>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900 flex justify-between items-center">
                      Copy these rules to your Firebase console:
                    </h4>
                    <div className="relative">
                      <pre className="text-[10px] sm:text-xs font-mono text-gray-700 bg-white border border-gray-100 p-3 rounded-lg overflow-x-auto shadow-inner whitespace-pre-wrap">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && request.auth.token.email == 'vinodrathod5931@gmail.com';
    }
    match /users/{userId} {
      allow read, write: if isAdmin() || (request.auth != null && request.auth.uid == userId);
    }
    match /orders/{orderId} {
      allow read, write: if isAdmin();
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}`}
                      </pre>
                      <button 
                        onClick={() => copyToClipboard(`rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    function isAdmin() {\n      return request.auth != null && request.auth.token.email == 'vinodrathod5931@gmail.com';\n    }\n    match /users/{userId} {\n      allow read, write: if isAdmin() || (request.auth != null && request.auth.uid == userId);\n    }\n    match /orders/{orderId} {\n      allow read, write: if isAdmin();\n      allow read: if request.auth != null && resource.data.userId == request.auth.uid;\n      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;\n      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;\n    }\n  }\n}`)}
                        className="absolute top-2 right-2 p-1.5 bg-white border border-gray-200 rounded-md text-gray-500 hover:text-amber-600 hover:bg-amber-50 shadow-sm"
                        title="Copy rules"
                      >
                        {copiedDomain ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 pt-2 border-t border-gray-100">
                    <p className="font-semibold text-gray-900 mb-1">How to fix:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Go to your <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-amber-600 hover:underline">Firebase Console</a></li>
                      <li>Go to <strong>Firestore Database</strong> &gt; <strong>Rules</strong> tab</li>
                      <li>Replace the existing rules with the copied code above</li>
                      <li>Click <strong>Publish</strong> and try again</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">{authError.message}</p>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setAuthError(null)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};
