import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { getLenta } from "../services/lentaServer";
import "./Lenta.css";

const EstadisticasLenta = () => {
  // Estado para almacenar datos y configuración
  const [metricas, setMetricas] = useState({
    valorMedio: 0,
    valorMinimo: 0,
    valorMaximo: 0,
    datosGrafico: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros por defecto (mes y año actual)
  const fechaActual = new Date();
  const [filtros, setFiltros] = useState({
    mes: fechaActual.getMonth() + 1,
    año: fechaActual.getFullYear()
  });

  // Cargar datos cuando cambian los filtros
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      
      try {
        // Obtener datos del servidor
        const datos = await getLenta();
        
        if (!datos || datos.length === 0) {
          throw new Error('No se recibieron datos');
        }
        
        // Filtrar por mes y año seleccionados
        const datosFiltrados = filtrarPorFecha(datos, filtros.mes, filtros.año);

        // Si no hay datos para el período seleccionado
        if (datosFiltrados.length === 0) {
          setMetricas({
            valorMedio: 0,
            valorMinimo: 0,
            valorMaximo: 0,
            datosGrafico: []
          });
          setLoading(false);
          return;
        }

        // Calcular métricas
        const metricas = calcularMetricas(datosFiltrados);
        
        // Actualizar el estado
        setMetricas(metricas);
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar datos:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [filtros.mes, filtros.año]);

  // Función para filtrar datos por fecha
  const filtrarPorFecha = (datos, mes, año) => {
    return datos.filter(item => {
      if (!item.fecha) return false;
      const fecha = new Date(item.fecha);
      return fecha.getMonth() + 1 === mes && fecha.getFullYear() === año;
    });
  };

  // Función para calcular métricas a partir de datos filtrados
  const calcularMetricas = (datos) => {
    // Extraer valores numéricos
    const valores = datos
      .map(item => parseFloat(item.lenta))
      .filter(valor => valor > 0);
    
    // Calcular estadísticas
    const valorMedio = valores.length > 0 
      ? (valores.reduce((sum, val) => sum + val, 0) / valores.length).toFixed(2)
      : 0;
    
    const valorMinimo = valores.length > 0 
      ? Math.min(...valores) 
      : 0;
    
    const valorMaximo = valores.length > 0 
      ? Math.max(...valores) 
      : 0;

    // Formatear datos para el gráfico
    const datosGrafico = datos.map(item => {
      const fecha = new Date(item.fecha);
      return {
        fecha: fecha.getDate().toString(),
        lenta: parseFloat(item.lenta),
        fechaCompleta: item.fecha
      };
    }).sort((a, b) => new Date(a.fechaCompleta) - new Date(b.fechaCompleta));

    return {
      valorMedio,
      valorMinimo,
      valorMaximo,
      datosGrafico
    };
  };

  // Manejadores de cambio de filtros
  const cambiarMes = (e) => {
    setFiltros(prev => ({
      ...prev,
      mes: parseInt(e.target.value)
    }));
  };

  const cambiarAño = (e) => {
    setFiltros(prev => ({
      ...prev,
      año: parseInt(e.target.value)
    }));
  };

  // Componente para tooltip personalizado
  const TooltipPersonalizado = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dato = payload[0].payload;
      const fecha = new Date(dato.fechaCompleta);
      const fechaFormateada = fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      return (
        <div className="custom-tooltip" style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <p className="label" style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
            {`Fecha: ${fechaFormateada}`}
          </p>
          <p className="value" style={{ margin: '0', color: '#8884d8' }}>
            {`Valor LENTA: ${payload[0].value}`}
          </p>
        </div>
      );
    }
  
    return null;
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="estadisticas-container">
        <h2>Estadísticas LENTA</h2>
        <div className="loading-spinner">
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="estadisticas-container">
        <h2>Estadísticas LENTA</h2>
        <div className="error-message">
          <p>Error al cargar las estadísticas: {error}</p>
        </div>
      </div>
    );
  }

  // Opciones para los selectores
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const años = Array.from(
    { length: 6 }, 
    (_, i) => fechaActual.getFullYear() - 5 + i
  );

  return (
    <div className="estadisticas-container">
      <h2>Estadísticas LENTA</h2>
      
      {/* Panel de filtros */}
      <div className="filtros">
        <div className="filtro-item">
          <label htmlFor="mes">Mes:</label>
          <select 
            id="mes" 
            value={filtros.mes} 
            onChange={cambiarMes}
          >
            {meses.map((nombreMes, index) => (
              <option key={index + 1} value={index + 1}>
                {nombreMes}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filtro-item">
          <label htmlFor="año">Año:</label>
          <select 
            id="año" 
            value={filtros.año} 
            onChange={cambiarAño}
          >
            {años.map((año) => (
              <option key={año} value={año}>{año}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tarjetas de métricas */}
      <div className="tarjetas-estadisticas">
        <div className="tarjeta">
          <div className="tarjeta-header">
            <h3>Valor Medio</h3>
            <span className="icono-estadistica">📊</span>
          </div>
          <div className="tarjeta-valor">{metricas.valorMedio}</div>
        </div>
        
        <div className="tarjeta">
          <div className="tarjeta-header">
            <h3>Valor Mínimo</h3>
            <span className="icono-estadistica">⬇️</span>
          </div>
          <div className="tarjeta-valor">{metricas.valorMinimo}</div>
        </div>
        
        <div className="tarjeta">
          <div className="tarjeta-header">
            <h3>Valor Máximo</h3>
            <span className="icono-estadistica">⬆️</span>
          </div>
          <div className="tarjeta-valor">{metricas.valorMaximo}</div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="grafico-container">
        <h3>
          Evolución del valor LENTA - {meses[filtros.mes - 1]} {filtros.año}
        </h3>
        <div className="grafico">
          {metricas.datosGrafico.length > 0 ? (
            <LineChart
              width={600}
              height={300}
              data={metricas.datosGrafico}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis domain={[0, 'auto']} />
              <Tooltip content={<TooltipPersonalizado />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="lenta"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Valor LENTA"
                strokeWidth={2}
              />
            </LineChart>
          ) : (
            <p>No hay datos disponibles para mostrar en el gráfico</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstadisticasLenta;