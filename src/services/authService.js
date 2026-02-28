const API_URL = "/api/v1"; 

export const registerService = async (userData, tipoAliado) => {
  const endpoint = tipoAliado === 'JURIDICO' ? 'aliados-juridicos' : 'aliados-naturales';
  const mappedData = {
    email: userData.correo || userData.email,
    password: userData.contrasena || userData.password,
    nombre: userData.nombre,
    apellido: userData.apellido || "N/A", 
    rol: tipoAliado === 'JURIDICO' ? 'ALIADO_JURIDICO' : 'ALIADO_NATURAL',
    activo: true,
    ...(tipoAliado === 'NATURAL' && {
      documento: userData.numeroDocumento,
      tipo_documento: 'CC', 
      nombre: `${userData.nombre} ${userData.apellido || ""}`.trim(),
      telefono: userData.telefono,
      direccion: userData.direccion
    }),
    ...(tipoAliado === 'JURIDICO' && {
      nit: userData.numeroDocumento,
      razon_social: userData.nombre, 
      representante: userData.representante || userData.nombre,
      email: userData.correo || userData.email,
      telefono: userData.telefono,
      direccion: userData.direccion
    })
  };

  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mappedData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}`);
  }
  return await response.json();
};

export const loginService = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }), 
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || '401');
  return data;
};