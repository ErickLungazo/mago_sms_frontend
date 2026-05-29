import { useState } from 'react';
import api from './api';

export default function Login({ onLogin }) {
    const [loginType, setLoginType] = useState('staff'); // 'staff' or 'student'
    const [identifier, setIdentifier] = useState(''); // email or admission_number
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const url = loginType === 'staff' ? '/login' : '/student/login';
            const payload = loginType === 'staff' ? { email: identifier, password } : { admission_number: identifier, password };
            
            const response = await api.post(url, payload);
            localStorage.setItem('auth_token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            onLogin(response.data.user);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[#f8fafc] p-6">
            <div className="w-full max-w-md bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#0a6e4e]"></div>
                
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic mb-2">MAGO TVTC</h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Institutional Management System</p>
                </div>

                <div className="flex gap-2 mb-8 bg-gray-50 p-1.5 rounded-2xl">
                    <button 
                        onClick={() => { setLoginType('staff'); setIdentifier(''); }}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginType === 'staff' ? 'bg-white shadow-md text-[#0a6e4e]' : 'text-gray-400 hover:text-gray-600'}`}
                    >Staff Portal</button>
                    <button 
                        onClick={() => { setLoginType('student'); setIdentifier(''); }}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginType === 'student' ? 'bg-white shadow-md text-[#0a6e4e]' : 'text-gray-400 hover:text-gray-600'}`}
                    >Student Portal</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                            {loginType === 'staff' ? 'Email Address' : 'Admission Number'}
                        </label>
                        <input
                            type={loginType === 'staff' ? 'email' : 'text'}
                            required
                            placeholder={loginType === 'staff' ? 'name@mago.test' : 'MG...'}
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#0a6e4e]/10 focus:bg-white transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#0a6e4e]/10 focus:bg-white transition-all font-medium"
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest text-center rounded-xl border border-red-100 animate-pulse">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-[#0a6e4e] text-white rounded-[25px] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-[#0a6e4e]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Access Terminal'}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-gray-50 text-center">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Secure AES-256 Encrypted Session</p>
                </div>
            </div>
        </div>
    );
}
