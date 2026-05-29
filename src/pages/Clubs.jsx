import React, { useState, useEffect } from 'react';
import api from '../api';

const BRAND = "#0a6e4e";

export default function Clubs() {
    const [clubs, setClubs] = useState([]);
    const [staff, setStaff] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", patron_staff_id: "", department_scope: "All Departments" });

    const fetchData = async () => {
        try {
            const [cRes, sRes] = await Promise.all([api.get('/clubs'), api.get('/staff')]);
            setClubs(cRes.data.data || cRes.data || []);
            setStaff(sRes.data.data || sRes.data || []);
        } catch (err) {}
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/clubs', form);
            setShowForm(false);
            setForm({ name: "", patron_staff_id: "", department_scope: "All Departments" });
            fetchData();
        } catch (err) {}
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete club?")) return;
        await api.delete(`/clubs/${id}`);
        fetchData();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter">Clubs & Societies</h2>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Institutional Student Organizations</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="px-8 py-3 bg-[#0a6e4e] text-white rounded-full font-black hover:scale-105 transition-all shadow-xl shadow-[#0a6e4e]/20"
                >
                    + NEW CLUB
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl mb-12 animate-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Club Name</label>
                            <input 
                                required 
                                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-[#0a6e4e]/5 transition-all"
                                placeholder="e.g. Entrepreneurship Club" 
                                value={form.name} 
                                onChange={e=>setForm({...form, name:e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Patron (Staff)</label>
                            <select 
                                required
                                className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                                value={form.patron_staff_id} 
                                onChange={e=>setForm({...form, patron_staff_id:e.target.value})}
                            >
                                <option value="">Select Patron...</option>
                                {staff.map(s => <option key={s.id} value={s.id}>{s.name} ({s.department?.name})</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mt-8 flex gap-4">
                        <button type="submit" className="px-10 py-4 bg-[#0a6e4e] text-white rounded-2xl font-black shadow-lg">CREATE ORGANIZATION</button>
                        <button type="button" onClick={()=>setShowForm(false)} className="px-10 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black">CANCEL</button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {clubs.map(c => (
                    <div key={c.id} className="group bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-[#0a6e4e] opacity-20 group-hover:opacity-100 transition-opacity"></div>
                        <button 
                            onClick={() => handleDelete(c.id)}
                            className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500"
                        >
                            🗑️
                        </button>
                        
                        <div className="text-4xl mb-4">🤝</div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">{c.name}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">{c.department_scope}</p>
                        
                        <div className="pt-6 border-t border-gray-50">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Patron</div>
                            <div className="font-bold text-[#0a6e4e]">{c.patron?.name || 'Vacant'}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
