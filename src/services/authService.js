const API_URL = "/api/v1";

export const registerService = async (userData, tipoAliado) => {
  const endpoint = tipoAliado === 'JURIDICO' ? 'aliados-juridicos' : 'aliados-naturales';

  const mappedData = tipoAliado === 'JURIDICO'
    ? {
        email:         userData.email,
        password:      userData.password,
        nit:           userData.nit || userData.numeroDocumento,
        razonSocial:   userData.razonSocial || userData.nombre,
        representante: userData.representanteLegal || userData.representante || userData.nombre,
        telefono:      userData.telefono,
        direccion:     userData.direccion,
      }
    : {
        email:         userData.email,
        password:      userData.password,
        nombre:        `${userData.nombre} ${userData.apellido || ''}`.trim(),
        documento:     userData.documento || userData.numeroDocumento,
        tipoDocumento: (userData.tipoDocumento || userData.tipo_documento || 'CC').toUpperCase(),
        telefono:      userData.telefono,
        direccion:     userData.direccion,
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

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Credenciales inválidas');
  }
  return await response.json();
};