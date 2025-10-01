
import React, { use } from 'react'
import { AuthContext } from '../context/AuthContext';


export default function useAuth() {
 const authInfo = use(AuthContext);
 return authInfo;
}
