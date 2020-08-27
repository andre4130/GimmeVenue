//import alert actions
import {
    REGISTRO_EXITOSO,
    REGISTRO_ERROR,
    OBTENER_USUARIO,
    LOGIN_ERROR,
    CERRAR_SESION,
    LOGIN_EXITOSO,
} from '../../types/index'

export default (state, action) => {
    switch(action.type) {
        case REGISTRO_EXITOSO:
        case LOGIN_EXITOSO:
            localStorage.setItem('token', action.payload.token)
            return {
                ...state,
                authentication: true,
                msg: null
            };
        case LOGIN_ERROR:
        case REGISTRO_ERROR:
            localStorage.removeItem('token')
            return {
                ...state, 
                token: null,
                msg: action.payload
            };
        case OBTENER_USUARIO: 
        return {
            ...state, 
            user: action.payload
        };

        default:
            return state;
    }
};