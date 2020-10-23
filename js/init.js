// Your web app's Firebase configuration
var firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_FIREBASE_DOMAIN_NAME",
     databaseURL: "YOUR_FIREBASE_DATBASE_URL",
     projectId: "YOUR_FIREBASE_PROJECT_ID",
     storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET END WITH appspot.com",
     messagingSenderId: "YOUR SENDER ID",
     appId: "YOUR APP ID",
     measurementId: "YOUR MEASUREMENT ID"
 };

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

// Revisar que el usuario este logeado

firebase.auth().onAuthStateChanged(function(user) {
     if (user) {
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;

          var textoVerificado = "";
          
          if(emailVerified === false) {
               textoVerificado = "Email no verificado";
          } else {
               textoVerificado = "Email verificado";
          }

          document.getElementById('login').innerHTML = 
          `<p>Logeado ` + email + `, ` + textoVerificado + `</p>` + 
          `<button onclick="cerrar()">Cerrar sesión</button>`
     } else {
          document.getElementById('login').innerHTML = "No Logeado.";
     }
});

function verificar() {
     var user = firebase.auth().currentUser;
     
     user.sendEmailVerification().then(function() {
          // Email sent.
     }).catch(function(error) {
          // An error happened.
     });
}

// Agregar usuarios

function guardar() {
     var email = document.getElementById('email').value;
     var pass = document.getElementById('pass').value;

     firebase.auth().createUserWithEmailAndPassword(email, pass)
     .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;

          alert(errorMessage);
     })
     .then(function() {
          verificar();
     });
}

// Login usuarios

function login() {
     var emailNew = document.getElementById('emailNew').value;
     var passNew = document.getElementById('passNew').value;
     
     firebase.auth().signInWithEmailAndPassword(emailNew, passNew)
     .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          
          alert(errorMessage);
     });
}

// Cerrar sesion

function cerrar() {
     firebase.auth().signOut()
     .then(function() {
          console.log('Salir');
     })
     .catch(function(err) {
          console.log(error);
     });
}

// Notificaciones

const messaging = firebase.messaging();

messaging.usePublicVapidKey("KEY");

function IntitalizeFireBaseMessaging() {
     messaging
          .requestPermission()
          .then(function () {
               console.log("Notification Permission");
               console.log(messaging.getToken());
               return messaging.getToken();
          })
          .then(function (token) {
               console.log("Token : "+token);
               document.getElementById("token").innerHTML=token;
          })
          .catch(function (reason) {
               console.log(reason);
          });
}

messaging.onMessage(function (payload) {
     console.log(payload);
     const notificationOption={
          body:payload.notification.body,
          icon:payload.notification.icon
     };

     if(Notification.permission==="granted"){
          var notification=new Notification(payload.notification.title,notificationOption);

          notification.onclick=function (ev) {
               ev.preventDefault();
               window.open(payload.notification.click_action,'_blank');
               notification.close();
          }
     }

});
messaging.onTokenRefresh(function () {
     messaging.getToken()
          .then(function (newtoken) {
               console.log("New Token : "+ newtoken);
          })
          .catch(function (reason) {
               console.log(reason);
          })
})
IntitalizeFireBaseMessaging();