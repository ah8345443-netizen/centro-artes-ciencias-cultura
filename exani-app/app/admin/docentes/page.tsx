"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type Profile={
  id:string;
  full_name:string;
  email:string|null;
  role:"admin"|"teacher"|"student";
  access_status:"active"|"blocked"|"expired";
  course:string|null;
};

type Assignment={teacher_id:string;student_id:string};

export default function AdminDocentesPage(){
  const [profiles,setProfiles]=useState<Profile[]>([]);
  const [assignments,setAssignments]=useState<Assignment[]>([]);
  const [selectedTeacher,setSelectedTeacher]=useState<string>("");
  const [loading,setLoading]=useState(true);
  const [message,setMessage]=useState("");
  const [success,setSuccess]=useState("");
  const [saving,setSaving]=useState(false);

  async function load(){
    setLoading(true);
    const supabase=createClient();
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){window.location.href="/login";return;}
    const {data:me}=await supabase.from("profiles").select("role").eq("id",user.id).single();
    if(me?.role!=="admin"){window.location.href="/dashboard";return;}

    const [p,a]=await Promise.all([
      supabase.from("profiles").select("id,full_name,email,role,access_status,course").order("full_name"),
      supabase.from("teacher_student_assignments").select("teacher_id,student_id")
    ]);
    setProfiles((p.data??[]) as Profile[]);
    setAssignments((a.data??[]) as Assignment[]);
    setLoading(false);
  }

  useEffect(()=>{load()},[]);

  const teachers=useMemo(()=>profiles.filter(p=>p.role==="teacher"),[profiles]);
  const students=useMemo(()=>profiles.filter(p=>p.role==="student"),[profiles]);
  const selected=teachers.find(t=>t.id===selectedTeacher)||null;
  const assignedSet=useMemo(()=>new Set(assignments.filter(a=>a.teacher_id===selectedTeacher).map(a=>a.student_id)),[assignments,selectedTeacher]);

  async function changeRole(profile:Profile,role:"teacher"|"student"){
    setSaving(true);setMessage("");setSuccess("");
    const supabase=createClient();
    const {error}=await supabase.rpc("admin_set_profile_role",{requested_user_id:profile.id,requested_role:role});
    setSaving(false);
    if(error){setMessage(error.message.includes("cannot_demote_self")?"No puedes quitarte a ti mismo el rol de administrador.":"No fue posible cambiar el rol.");return;}
    setSuccess(role==="teacher"?"Usuario convertido en docente.":"Usuario convertido en alumno.");
    if(profile.id===selectedTeacher&&role!=="teacher")setSelectedTeacher("");
    await load();
  }

  async function toggleAssignment(studentId:string,assigned:boolean){
    if(!selectedTeacher)return;
    setSaving(true);setMessage("");setSuccess("");
    const supabase=createClient();
    const {error}=await supabase.rpc("admin_assign_teacher_student",{
      requested_teacher_id:selectedTeacher,
      requested_student_id:studentId,
      requested_assigned:assigned
    });
    setSaving(false);
    if(error){setMessage("No fue posible actualizar la asignación.");return;}
    setAssignments(prev=>assigned?[...prev.filter(a=>!(a.teacher_id===selectedTeacher&&a.student_id===studentId)),{teacher_id:selectedTeacher,student_id:studentId}]:prev.filter(a=>!(a.teacher_id===selectedTeacher&&a.student_id===studentId)));
    setSuccess("Asignación actualizada.");
  }

  if(loading)return <main className="shell admin-shell"><section className="panel"><p>Cargando docentes...</p></section></main>;

  return <main className="shell admin-shell">
    <div className="topbar">
      <div><span className="eyebrow">Administración académica</span><h1 className="admin-heading">Docentes y grupos</h1><p className="muted-large">Define quién es docente y qué alumnos puede consultar.</p></div>
      <div className="actions compact"><a className="button secondary" href="/admin">Administración</a><a className="button secondary" href="/dashboard">Panel</a></div>
    </div>

    {message&&<p className="error">{message}</p>}
    {success&&<p className="success">{success}</p>}

    <section className="teacher-admin-metrics">
      <article><strong>{teachers.length}</strong><span>Docentes</span></article>
      <article><strong>{students.length}</strong><span>Alumnos</span></article>
      <article><strong>{assignments.length}</strong><span>Asignaciones</span></article>
    </section>

    <section className="teacher-admin-layout">
      <div>
        <div className="section-bar"><div><span className="eyebrow">Roles</span><h2>Usuarios académicos</h2></div></div>
        <div className="role-user-list">
          {profiles.filter(p=>p.role!=="admin").map(p=><article key={p.id}>
            <div><strong>{p.full_name}</strong><span>{p.email??"Sin correo"}</span><small>{p.access_status} · {p.course??"sin curso"}</small></div>
            <select value={p.role} disabled={saving} onChange={e=>changeRole(p,e.target.value as "teacher"|"student")}><option value="student">Alumno</option><option value="teacher">Docente</option></select>
          </article>)}
        </div>
      </div>

      <aside className="assignment-panel">
        <span className="eyebrow">Asignación de grupo</span>
        <h2>Alumnos por docente</h2>
        <label>Docente
          <select value={selectedTeacher} onChange={e=>setSelectedTeacher(e.target.value)}>
            <option value="">Selecciona un docente</option>
            {teachers.map(t=><option value={t.id} key={t.id}>{t.full_name}</option>)}
          </select>
        </label>

        {selected&&<div className="assignment-list">
          <p>Selecciona los alumnos que <strong>{selected.full_name}</strong> podrá consultar.</p>
          {students.map(s=><label className="assignment-row" key={s.id}><input type="checkbox" checked={assignedSet.has(s.id)} disabled={saving} onChange={e=>toggleAssignment(s.id,e.target.checked)}/><span><strong>{s.full_name}</strong><small>{s.course??"Sin curso"}</small></span></label>)}
          {!students.length&&<div className="empty-state">No hay alumnos disponibles.</div>}
        </div>}
      </aside>
    </section>
  </main>
}
