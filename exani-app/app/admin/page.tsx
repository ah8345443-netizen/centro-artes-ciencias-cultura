const users = [
  { name: "Alumno de ejemplo", course: "EXANI II", status: "Activo" },
  { name: "Usuario bloqueado", course: "EXANI I", status: "Bloqueado" },
];

export default function AdminPage() {
  return (
    <main className="shell">
      <div className="topbar"><div><p className="eyebrow">Administración</p><h1>Usuarios y accesos</h1></div><button className="button primary">Agregar alumno</button></div>
      <section className="panel">
        <div className="table">
          <div className="table-head"><span>Alumno</span><span>Curso</span><span>Estado</span><span>Acción</span></div>
          {users.map((u) => (
            <div className="table-row" key={u.name}>
              <span>{u.name}</span><span>{u.course}</span><span>{u.status}</span><button className="button secondary">Gestionar</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
