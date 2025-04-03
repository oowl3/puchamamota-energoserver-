import React from 'react'
import Header_home from '@/app/components/elements/header/Header_home'
const Questions = () => {
  return (
    <div>
<Header_home/>
        <h5>Seccion de preguntas frecuentes</h5>
        <hr />
        <ul>
        <h6>¿Como se instala el sensor </h6>
        <p>La instalacion es sencilla:solo debes conectar el sensor entre el enchufe y el dispositivo que deseas monitorear,luego, sigues las intrucciones en la plataforma para vincularlo a tu cuenta </p> 
        <br/>
        <h6>¿Cada cuanto tiempo se actualiza los datos de consumo?</h6>
        <p>Los datos se actualizan en tiempo real o con una pequeña demora de segundos dependiendo de la conexion a internet</p>
        <br/>
        <h6>¿Puedo conectar mas de un sensor a la misma cuenta?</h6>
        <p>Si, puedes conectar varios sensores a tu cuenta sin problemas. Solo añadelos desde la plataforma siguiendo unos simples pasos, y empezaras a monitorear a tus dispositivos en un solo lugar </p>
        <br/>
        <h6>¿Que datos almacena la plataforma sobre su consumo</h6>
        <p>Tu privacidad es nuestra prioridad. Solo registramos los datos esenciales sobre el consumo de energia de tus dispositivos para ofrecerte un mejor analisis. No compartimos ni vendemos tu informacion a terceros </p>
        <br/>
        <h6>¿Como creo la plataforma en mi perfil</h6>
        <p>Regitrate en menos de un minuto con tu correo electroniuco y una contraseña. Una vez dentro, agrega tus sensores y empieza a optimizar tu consumo de energia !crea tu cuenta ahora!</p>
        </ul>
    </div>
    
  )
}

export default Questions