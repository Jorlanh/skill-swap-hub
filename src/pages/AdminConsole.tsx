import React, { useEffect, useState } from 'react';
import { AdminService } from '@/services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserX, Activity, Users, Zap } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const AdminConsole = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        AdminService.getStats(),
        AdminService.getUsers()
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast({ title: "Acesso Negado", description: "Você não possui credenciais manage:console.", variant: "destructive" });
    }
  };

  const handleToggleVerify = async (userId: string) => {
    try {
      await AdminService.toggleVerification(userId);
      toast({ title: "Sucesso", description: "Status de verificação alterado." });
      loadAdminData();
    } catch (error) {
      toast({ title: "Erro", description: "Falha na operação.", variant: "destructive" });
    }
  };

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldCheck className="text-red-500" size={32} /> 
          Painel de Controle Oculto
        </h1>
        <Badge variant="outline" className="text-red-500 border-red-500 animate-pulse">SISTEMA EM MODO ROOT</Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total de Usuários" value={stats?.totalUsers || 0} icon={<Users />} />
        <StatCard title="Trocas Ativas" value={stats?.activeSwaps || 0} icon={<Activity />} />
        <StatCard title="Novos Hoje" value={stats?.newUsersToday || 0} icon={<Zap />} />
      </div>

      {/* Users Table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Gestão de Usuários e Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800">
                <TableHead className="text-zinc-400">Usuário</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400">Verificado</TableHead>
                <TableHead className="text-zinc-400 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-zinc-800">
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    {user.isBanned ? <Badge variant="destructive">Banido</Badge> : <Badge className="bg-green-600">Ativo</Badge>}
                  </TableCell>
                  <TableCell>
                    {user.isVerified ? "Sim" : "Não"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleToggleVerify(user.id)}>
                      {user.isVerified ? "Remover Selo" : "Dar Selo"}
                    </Button>
                    <Button size="sm" variant="destructive" className="bg-red-900 hover:bg-red-700">
                      <UserX size={14} className="mr-1" /> Banir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value, icon }: any) => (
  <Card className="bg-zinc-900 border-zinc-800 text-white">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
      <div className="text-zinc-500">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default AdminConsole;