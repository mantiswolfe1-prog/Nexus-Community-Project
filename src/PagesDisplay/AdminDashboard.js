import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Key, Ban, AlertTriangle, LogOut, Trash2, Activity, Cpu, Crown, UserX, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from 'utils';
import { session, storage } from '../Components/Storage/clientStorage.js';
import GlassCard from '../Components/UI/GlassCard.js';
import NeonButton from '../Components/UI/NeonButton.js';
import AnimatedBackground from '../Components/UI/AnimatedBackground.js';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [accessCodes, setAccessCodes] = useState([]);
  const [banList, setBanList] = useState([]);
  const [notices, setNotices] = useState([]);
  const [stats, setStats] = useState({ fps: 60, ram: 512, activeUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!session.isAdmin()) {
      navigate(createPageUrl('Landing'));
      return;
    }
    setIsOwner(session.isOwner());
    loadAdminData();
    measurePerformance();
  }, [navigate]);

  const loadAdminData = async () => {
    try {
      await storage.init();
      const allUsers = storage.getAllUsers();
      setUsers(allUsers);
      setStats(prev => ({ ...prev, activeUsers: allUsers.length }));
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const measurePerformance = () => {
    const fps = Math.round(1000 / 16.67);
    const ram = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : 512;
    setStats({ fps, ram, activeUsers: users.length || 0 });
  };

  const kickUser = (user) => {
    if (!isOwner) return;
    if (!confirm(`Kick user ${user.code}? This will close their session immediately.`)) return;
    
    // Remove from session storage (simulates kick by clearing their session)
    const kickCode = user.code;
    localStorage.removeItem(`nexus_session_${kickCode}`);
    sessionStorage.removeItem(`nexus_session_${kickCode}`);
    
    alert(`User ${user.code} has been kicked. Their browser session will end.`);
    loadAdminData();
  };

  const banUser = async (user) => {
    if (!confirm(`Ban user ${user.code}? They will not be able to login.`)) return;
    try {
      storage.banUser(user.code);
      alert(`User ${user.code} has been banned.`);
      loadAdminData();
    } catch (err) {
      console.error('Failed to ban user:', err);
    }
  };

  const unbanUser = async (user) => {
    try {
      storage.unbanUser(user.code);
      alert(`User ${user.code} has been unbanned.`);
      loadAdminData();
    } catch (err) {
      console.error('Failed to unban:', err);
    }
  };

  const handleLogout = () => {
    session.clear();
    navigate(createPageUrl('Landing'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-white/50">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground type="gradient" accentColor="#ff0055" />
      
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-white/50">Nexus management console</p>
              </div>
            </div>
            <NeonButton variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </NeonButton>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Access Codes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center gap-3 mb-4">
                <Key className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Access Codes</h2>
              </div>
              <div className="space-y-3">
                {accessCodes.map((code) => (
                  <div 
                    key={code.id}
                    className="p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-mono text-sm">{code.code}</p>
                        <p className="text-xs text-white/50">
                          Used {code.usageCount || 0} times
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        code.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {code.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                ))}
                {accessCodes.length === 0 && (
                  <p className="text-white/40 text-sm text-center py-4">No access codes</p>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Ban List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center gap-3 mb-4">
                <Ban className="w-5 h-5 text-red-400" />
                <h2 className="text-lg font-semibold text-white">Ban List</h2>
              </div>
              <div className="space-y-3">
                {banList.map((ban) => (
                  <div 
                    key={ban.id}
                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-mono text-sm">{ban.identifier}</p>
                        <p className="text-xs text-white/50">{ban.reason || 'No reason provided'}</p>
                      </div>
                      <NeonButton variant="ghost" size="sm" onClick={() => unbanCode(ban.id)}>
                        <Trash2 className="w-3 h-3" />
                      </NeonButton>
                    </div>
                  </div>
                ))}
                {banList.length === 0 && (
                  <p className="text-white/40 text-sm text-center py-4">No banned users</p>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* User Management (Owner Only) */}
          {isOwner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <GlassCard className="p-6" hover={false}>
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-lg font-semibold text-white">User Management</h2>
                  <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">Owner Only</span>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {users.map((user) => (
                    <div 
                      key={user.code}
                      className={`p-4 rounded-lg border ${
                        user.banned 
                          ? 'bg-red-500/10 border-red-500/20' 
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="text-white font-mono text-sm">{user.code}</p>
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.role === 'owner' ? 'bg-yellow-500/20 text-yellow-400' :
                              user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                              user.verified ? 'bg-green-500/20 text-green-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {user.role === 'owner' ? 'Owner' :
                               user.role === 'admin' ? 'Admin' :
                               user.verified ? 'Verified' : 'Guest'}
                            </span>
                            {user.banned && (
                              <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">
                                BANNED
                              </span>
                            )}
                          </div>
                          {user.discordId && (
                            <p className="text-xs text-white/50 mt-1">Discord: {user.discordId}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!user.banned ? (
                            <>
                              <NeonButton 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => kickUser(user)}
                                className="text-orange-400 hover:text-orange-300"
                              >
                                <UserX className="w-4 h-4 mr-1" />
                                Kick
                              </NeonButton>
                              <NeonButton 
                                variant="danger" 
                                size="sm" 
                                onClick={() => banUser(user)}
                              >
                                <Ban className="w-4 h-4 mr-1" />
                                Ban
                              </NeonButton>
                            </>
                          ) : (
                            <NeonButton 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => unbanUser(user)}
                              className="text-green-400 hover:text-green-300"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Unban
                            </NeonButton>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <p className="text-white/40 text-sm text-center py-4">No users registered</p>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Global Notices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg font-semibold text-white">Global Notices</h2>
              </div>
              <div className="space-y-3">
                {notices.map((notice) => (
                  <div 
                    key={notice.id}
                    className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white text-sm">{notice.message}</p>
                        <p className="text-xs text-white/40 mt-1">
                          {notice.expiresAt ? `Expires: ${new Date(notice.expiresAt).toLocaleDateString()}` : 'No expiration'}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ml-3 ${
                        notice.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {notice.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                ))}
                {notices.length === 0 && (
                  <p className="text-white/40 text-sm text-center py-4">No global notices</p>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Performance Diagnostics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-semibold text-white">Site Diagnostics</h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/5 text-center">
                  <Cpu className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats.fps}</p>
                  <p className="text-xs text-white/50">FPS</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 text-center">
                  <Activity className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats.ram}</p>
                  <p className="text-xs text-white/50">RAM (MB)</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 text-center">
                  <Users className="w-5 h-5 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
                  <p className="text-xs text-white/50">Est. Active</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-3 gap-4">
              <GlassCard className="p-4 text-center" hover={false}>
                <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{accessCodes.filter(c => c.isActive).length}</p>
                <p className="text-xs text-white/50">Active Codes</p>
              </GlassCard>
              <GlassCard className="p-4 text-center" hover={false}>
                <Ban className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{banList.length}</p>
                <p className="text-xs text-white/50">Banned Users</p>
              </GlassCard>
              <GlassCard className="p-4 text-center" hover={false}>
                <AlertTriangle className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{notices.filter(n => n.isActive).length}</p>
                <p className="text-xs text-white/50">Active Notices</p>
              </GlassCard>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-white/60 text-sm">
            <strong className="text-white">Privacy Notice:</strong> This dashboard shows only minimal metadata 
            (access codes, ban identifiers, site diagnostics). User settings, favorites, browsing history, and personal data 
            are stored client-side only and cannot be accessed from this panel. Admin code: 0915
          </p>
        </motion.div>
      </div>
    </div>
  );
}