/* eslint-disable no-template-curly-in-string */
import React, {useState} from 'react';
// import "./style.css";
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    useIonViewWillEnter,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonList,
    IonButton,
    IonItem,
    IonIcon,
    IonToast,
    IonImg
} from '@ionic/react';
import { addOutline, trashBinOutline, pencil, bookOutline, bookSharp, bookmarksOutline, bookmarks, trashOutline, createOutline } from 'ionicons/icons';
import {firebaseConfig} from '../database/config'
import firebase from 'firebase/app'; // npm i firebase
import './Tab1.css';
import 'firebase/firebase-firestore';
import {equipo} from '../modelo/equipo'

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const Tab1: React.FC = () => {

    const [listaEquipo, setListaEquipo] = useState < equipo[] > ([]); 
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [titulos, setTitulos] = useState('');
    const [mensaje, setMensaje] = useState(false);
    const [bandera, setBandera] = useState(true);
    const listar = async () => {
        try {
            let lista: equipo[] = []
            const res = await firebase.firestore().collection('Actividades Universitarias').get();
            res.forEach((doc) => {
                let obj = {
                    id: doc.id,
                    nombre: doc.data().nombre,
                    titulos: doc.data().titulos
                };
                lista.push(obj)
    
            });
            setListaEquipo(lista)
        } catch (error) {}
    }

    const crear = async () => {
        try {
            if(bandera){
                await firebase.firestore().collection('Actividades Universitarias').add(
                    {nombre, titulos});
                   
            }else{
                await firebase.firestore().collection('Actividades Universitarias').doc(id).set(
                    {nombre, titulos});
                    setBandera(true);
            }
             
        } catch (error) {}
        setId('');
        setNombre('');
        setTitulos('');
        setMensaje(true);
        listar();  
    }


    const eliminar = async(id:string) =>{
        try {
            console.log(id)
            await firebase.firestore().collection('Actividades Universitarias').doc(id).delete();
            listar();  
        } catch (error) {}       
    }

    const editar = (id:string,nombre:string,titulo:string) => {
      setId(id);
      setNombre(nombre);
      setTitulos(titulo);
      setBandera(false);
  } 

    useIonViewWillEnter(() => {
        listar();
    })


  
    return (
        <IonPage>
        <IonToast
           isOpen={mensaje}
           onDidDismiss={() => setMensaje(false)}
           message="Actividad Gurdada"
           duration={500}
          />
            <IonHeader>
                <IonToolbar color="secondary">
                    <IonTitle style={{textAlign: "center"}}><IonIcon icon={bookOutline}></IonIcon>APUNTES UNIVERSITARIOS<IonIcon icon={bookSharp}></IonIcon></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Equipo</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonCard>
                <IonImg src='../assets/actividad.png'></IonImg>
                </IonCard>

                <IonCard>
                    <IonItem >
                        <IonInput value={nombre}
                            placeholder="Actividad a realizarse"
                            onIonChange={ e => setNombre(e.detail.value!) }
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput value={titulos}
                            placeholder="Plazo de la actividad"
                            onIonChange={ e => setTitulos(e.detail.value!) }
                        ></IonInput>
                    </IonItem>
                    <IonButton color="primary" expand="block"
                        onClick={() => crear() }>
                        <IonIcon 
                            icon={bookOutline}>
                        </IonIcon>{bandera?' CREAR O ACTUALIZAR':'Editar'}
                    </IonButton>
                </IonCard>
                <IonList> {
                    listaEquipo.map(equipo => (
                        <IonCard key={equipo.id} >
                            <IonCardHeader>
                                <IonCardTitle>Actividad:{
                                    equipo.nombre
                                }</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                Tiempo establecido: {equipo.titulos} 
                                <IonButton color="danger" expand="block"
                               onClick={() => eliminar(''+equipo.id)}>
                             <IonIcon icon={trashOutline}></IonIcon>
                               Eliminar</IonButton>  
                        <IonButton color="tertiary" expand="block"
                         onClick={
                    () => editar(''+equipo.id,''+equipo.nombre,''+equipo.titulos)}>
                             <IonIcon icon={createOutline}></IonIcon>ACTUALIZAR ACTIVIDAD</IonButton>   
                            </IonCardContent>
                             
                        </IonCard>
                    )) }
                 </IonList>
            </IonContent>
        </IonPage>
    );
};
export default Tab1;
