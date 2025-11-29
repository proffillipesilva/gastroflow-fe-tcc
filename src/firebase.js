// src/firebase.js

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { toast } from 'react-hot-toast';

// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "gastroflow-91492.firebaseapp.com",
    projectId: "gastroflow-91492",
    storageBucket: "gastroflow-91492.firebasestorage.app",
    messagingSenderId: "199400500727",
    appId: "1:199400500727:web:070db59be62a4bc3ae52f2",
    measurementId: "G-3CS88ZDRZG"
};

// **IMPORTANTE:** O VAPID Key é necessário para o FCM na Web.
// SUBSTITUA "YOUR_VAPID_KEY_HERE" pela chave que você gerou no Console do Firebase 
// (Configurações do Projeto > Cloud Messaging > Certificados Web Push).
const VAPID_KEY = process.env.REACT_APP_VAPID_KEY;

// Inicializa o Firebase App
const app = initializeApp(firebaseConfig);

// Obtém a instância do Messaging
export const messaging = getMessaging(app);


/**
 * Solicita a permissão e obtém o Token do Dispositivo usando a VAPID Key.
 * @returns {Promise<string|null>} O token FCM para o dispositivo.
 */
export const requestForToken = async () => {
    try {
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            const currentToken = await getToken(messaging, {
                vapidKey: VAPID_KEY
            });

            if (currentToken) {
                console.log('Token FCM do dispositivo:', currentToken);
                // Você deve enviar este token para o seu servidor
                return currentToken;
            } else {
                console.log('Nenhum token disponível.');
                return null;
            }
        } else {
            console.log('Permissão de Notificação negada.');
            return null;
        }
    } catch (error) {
        console.error('Erro ao obter o token:', error);
        return null;
    }
};


/**
 * Listener de Mensagens em Foreground (App em foco)
 * Exibe a notificação como um Toast customizado estilizado com Tailwind CSS.
 * @returns {function} Função de unsubscribe para cleanup.
 */
export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log('Mensagem de Foreground recebida:', payload);

            const { title, body } = payload.notification;

            // Renderiza um toast customizado com classes Tailwind
            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                    onClick={() => toast.dismiss(t.id)} // Adiciona clique para fechar
                >
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                {/* Ícone de notificação (pode ser um SVG) */}
                                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.81 6.31 6 8.58 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a2 2 0 100 4m0-4a2 2 0 010-4" /></svg>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-bold text-gray-900">{title || 'Nova Mensagem'}</p>
                                <p className="mt-1 text-sm text-gray-700">{body || 'Toque para mais detalhes.'}</p>
                            </div>
                        </div>
                    </div>

                </div>
            ), {
                duration: 5000,
                position: 'top-right',
            });

            resolve(payload);
        });
    });