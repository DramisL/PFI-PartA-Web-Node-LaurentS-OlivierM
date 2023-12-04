let contentScrollPosition = 0;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering
function showWaitingGif() {
    eraseContent();
    $("#content").append($("<div class='waitingGifcontainer'><img class='waitingGif' src='images/Loading_icon.gif' /></div>'"));
}
function eraseContent() {
    $("#content").empty();
}
function saveContentScrollPosition() {
    contentScrollPosition = $("#content")[0].scrollTop;
}
function restoreContentScrollPosition() {
    $("#content")[0].scrollTop = contentScrollPosition;
}
function getFormData($form) {
    const removeTag = new RegExp("(<[a-zA-Z0-9]+>)|(</[a-zA-Z0-9]+>)", "g");
    var jsonObject = {};
    $.each($form.serializeArray(), (index, control) => {
        jsonObject[control.name] = control.value.replace(removeTag, "");
    });
    return jsonObject;
}
function logout() {
    API.logout().then(() => {
        renderLogin();
    });
}
function updateHeader(title, id) {
    let loggedUser = API.retrieveLoggedUser();
    $("#header").html(
        $(`
            <span title="Liste des photos" id="listPhotosCmd"> <img src="images/PhotoCloudLogo.png" class="appLogo"></span>
            <span class="viewTitle">`+ title
            + `<div class="cmdIcon fa fa-plus" id="newPhotoCmd" title="Ajouter une photo"></div>
            </span>
            <div class="headerMenusContainer"> <span>&nbsp;</span> <!--filler-->` +
            (loggedUser != null ? `
                <i title="Modifier votre profil">
                    <div class="UserAvatarSmall" userid="${loggedUser.Id}" id="editProfilCmd" style="background-image:url('${loggedUser.Avatar}')" title="${loggedUser.Name}"></div>
                </i>`: "") +
            `<div class="dropdown ms-auto dropdownLayout">
                <div data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="cmdIcon fa fa-ellipsis-vertical"></i>
                </div>
                <div class="dropdown-menu noselect" id="DDMenu">
                </div>
            </div>
            </div>
        `));
    updateDropDownMenu();
}
function updateDropDownMenu() {
    let loggedUser = API.retrieveLoggedUser();
    let DDMenu = $("#DDMenu");
    DDMenu.empty();
    if (loggedUser == null) {

        DDMenu.append($(`
        <span class="dropdown-item" id="loginCmd"><i class="menuIcon fa fa-sign-in mx-2"></i>Connexion</span>
        `));
    } else {
        if (loggedUser.Authorizations["readAccess"] == 2 && loggedUser.Authorizations["writeAccess"] == 2) {
            DDMenu.append($(`
            <span class="dropdown-item" id="manageUserCmd">
<i class="menuIcon fas fa-user-cog mx-2"></i>
Gestion des usagers
</span>
        `));
            DDMenu.append($(`<div class="dropdown-divider"></div>`));
        }
        DDMenu.append($(`
            <span class="dropdown-item" id="logoutCmd"><i class="menuIcon fa fa-sign-out mx-2"></i>Déconnexion</span>
        `));
    }
    DDMenu.append($(`<div class="dropdown-divider"></div>`));
    //let selectedCategory = "";
    //let selectClass = selectedCategory === "" ? "fa-check" : "fa-fw";
    /*DDMenu.append($(`
        <div class="dropdown-item menuItemLayout" id="allCatCmd">
            <i class="menuIcon fa ${selectClass} mx-2"></i> Toutes les catégories
        </div>
        `));*/
    /*categories.forEach(category => {
        selectClass = selectedCategory === category ? "fa-check" : "fa-fw";
        DDMenu.append($(`
            <div class="dropdown-item menuItemLayout category" id="allCatCmd">
                <i class="menuIcon fa ${selectClass} mx-2"></i> ${category}
            </div>
        `));
    })*/
    DDMenu.append($(`
            <span class="dropdown-item" id="listPhotosMenuCmd">
                <i class="menuIcon fa fa-image mx-2"></i>Liste des photos
            </span>
        `));
    DDMenu.append($(`<div class="dropdown-divider"></div> `));
    DDMenu.append($(`
        <div class="dropdown-item menuItemLayout" id="aboutCmd">
            <i class="menuIcon fa fa-info-circle mx-2"></i> À propos...
        </div>
        `));
    $('#aboutCmd').on("click", function () {
        renderAbout();
    });
    /*$('#allCatCmd').on("click", function () {
        selectedCategory = "";
        renderBookmarks();
    });
    $('.category').on("click", function () {
        selectedCategory = $(this).text().trim();
        renderBookmarks();
    });*/

    $('#manageUserCmd').on("click", async function () {
        saveContentScrollPosition();
        renderManageUser();
    });
    $('#loginCmd').on("click", async function () {
        saveContentScrollPosition();
        renderLogin();
    });
    $('#logoutCmd').on("click", async function () {
        logout();
    });
    $('#editProfilCmd').on("click", async function () {
        saveContentScrollPosition();
        renderEditProfil();
    });
    $('#listPhotosCmd').on("click", async function () {
        saveContentScrollPosition();
        renderListPhotos();
    });
    $('#listPhotosMenuCmd').on("click", async function () {
        saveContentScrollPosition();
        renderListPhotos();
    });
    $('#aboutCmd').on("click", function () {
        saveContentScrollPosition();
        renderAbout();
    });

}
function renderListPhotos() {
    timeout();
    eraseContent();
    updateHeader("Liste des photos", "listPhotos");
    $("#content").append(
        $(`
            
        `));
    restoreContentScrollPosition();
}
async function renderManageUser() {
    timeout();
    eraseContent();
    updateHeader("Gestion des usagers", "manageUser");
    $("#newPhotoCmd").hide();
    let contacts = await API.GetAccounts();
    if (contacts !== null) {
        contacts["data"].forEach(contact => {
            if (contact["Id"] != API.retrieveLoggedUser().Id)
                $("#content").append(renderUser(contact));
        });
        restoreContentScrollPosition();
        // Attached click events on command icons
        $(".editCmd").on("click", function () {
            saveContentScrollPosition();
            renderEditContactForm($(this).attr("editContactId"));
        });
        $(".deleteCmd").on("click", function () {
            saveContentScrollPosition();
            renderDelete(contacts["data"].find(user => user["Id"] == $(this).attr("deleteContactId")));
        });
        $(".addAdminCmd").on("click", function () {
            saveContentScrollPosition();
            let profilToUpdate = contacts["data"].find(user => user["Id"] == $(this).attr("editContactId"));
            profilToUpdate.Authorizations["readAccess"] = 2;
            profilToUpdate.Authorizations["writeAccess"] = 2;
            profilToUpdate.Password = "";
            API.modifyUserProfil(profilToUpdate, API.retrieveLoggedUser());
            renderManageUser();
        });
        $(".removeAdminCmd").on("click", function () {
            saveContentScrollPosition();
            let profilToUpdate = contacts["data"].find(user => user["Id"] == $(this).attr("editContactId"));
            profilToUpdate.Authorizations["readAccess"] = 1;
            profilToUpdate.Authorizations["writeAccess"] = 1;
            profilToUpdate.Password = "";
            API.modifyUserProfil(profilToUpdate, API.retrieveLoggedUser());
            renderManageUser();
        });
        $(".deleteCmd").on("click", function () {
            saveContentScrollPosition();
            renderDelete(contacts["data"].find(user => user["Id"] == $(this).attr("deleteContactId")));
        });
        $(".deleteCmd").on("click", function () {
            saveContentScrollPosition();
            renderDelete(contacts["data"].find(user => user["Id"] == $(this).attr("deleteContactId")));
        });
        $(".contactRow").on("click", function (e) { e.preventDefault(); })

    } else {
        renderError("Service introuvable");
    }
    $("#content").append(
        $(`
            
        `))
}
function renderEmailValidation() {
    timeout();
    eraseContent();
    updateHeader("Gestion des usagers", "manageUser");
    $("#newPhotoCmd").hide();
    $("#content").append(
        $(`
            
        `))
}
function renderAbout() {
    timeout();
    eraseContent();
    updateHeader("À propos...", "about");
    $("#newPhotoCmd").hide();
    $("#content").append(
        $(`
            <div class="aboutContainer">
                <h2>Gestionnaire de photos</h2>
                <hr>
                <p>
                    Petite application de gestion de photos multiusagers à titre de démonstration
                    d'interface utilisateur monopage réactive.
                </p>
                <p>
                    Auteur: Laurent Simard et Olvier Morin
                </p>
                <p>
                    Fait à partir du code de base fourni par Nicolas Chourot
                </p>
                <p>
                    <a href="https://github.com/DramisL/PFI-PartA-Web-Node-LaurentS-OlivierM">
                        Lien du répertoire GitHub
                    </a>
                </p>
                <p>
                    Collège Lionel-Groulx, automne 2023
                </p>
            </div>
        `));
}
function renderLogin(loginMessage = "", Email = "", EmailError = "", passwordError = "") {
    noTimeout();
    eraseContent();
    updateHeader("Connexion", "connect");
    $("#newPhotoCmd").hide();
    $("#content").append(
        $(`
        <div class="content" style="text-align:center">
            <h3>${loginMessage}</h3>
            <form class="form" id="loginForm">
                <input type='email'
                    name='Email'
                    class="form-control"
                    required
                    RequireMessage='Veuillez entrer votre courriel'
                    InvalidMessage='Courriel invalide'
                    placeholder="adresse de courriel"
                    value='${Email}'>
                <span style='color:red'>${EmailError}</span>
                <input type='password'
                    name='Password'
                    placeholder='Mot de passe'
                    class="form-control"
                    required
                    RequireMessage='Veuillez entrer votre mot de passe'>
                <span style='color:red'>${passwordError}</span>
                <input type='submit' name='submit' value="Entrer" class="form-control btn-primary">
            </form>
            <div class="form">
                <hr> <button class="form-control btn-info" id="createProfilCmd">Nouveau compte</button>
            </div>
        </div>
        `));
    $('#createProfilCmd').on("click", async function () {
        renderCreateProfil();
    });

    initFormValidation();
    // call back la soumission du formulaire 
    $('#loginForm').on("submit", function (event) {
        let profil = getFormData($('#loginForm'));
        event.preventDefault();// empêcher le fureteur de soumettre une requête de soumission
        API.eraseAccessToken();
        API.login(profil.Email, profil.Password).then(() => {
            switch (API.currentStatus) {
                case 0:
                    let loggedUser = API.retrieveLoggedUser();
                    if (loggedUser.VerifyCode == "verified") {
                        if (!loggedUser.isBlocked)
                            renderListPhotos();
                        else
                            loginMessage = "Votre compte a été bloqué par l'administrateur";
                    } else {
                        renderCodeVerification(loggedUser.Id);
                    }
                    break;
                case 481:
                    renderLogin("", profil.Email, "Courriel introuvable");
                    break;
                case 482:
                    renderLogin("", profil.Email, "", "Mot de passe incorrect");
                    break;
                default:
                    renderError();
                    break;
            }
        });
    });
}
function renderCodeVerification() {
    noTimeout();
    eraseContent();
    updateHeader("Vérification", "verify");
    $("#newPhotoCmd").hide();
    let error = "";
    $("#content").append(
        $(`
        <div class="content" style="text-align:center">
            <h3>Veuillez entrer le code de vérification que vous avez reçu par courriel</h3>
            <form class="form" id="verifyProfilForm">
                <input type='text'
                    name='verificationCode'
                    class="form-control"
                    required
                    RequireMessage='Veuillez entrer votre code de vérification'
                    InvalidMessage='Code de vérification invalide'
                    placeholder="Code de vérification de courriel">
                <span style='color:red'>${error}</span>
                <input type='submit' name='submit' value="Vérifier" class="form-control btn-primary">
            </form>
        </div>
        `));

    initFormValidation();
    // call back la soumission du formulaire 
    $('#verifyProfilForm').on("submit", function (event) {
        let form = getFormData($('#verifyProfilForm'));
        event.preventDefault();// empêcher le fureteur de soumettre une requête de soumission
        API.verifyEmail(API.retrieveLoggedUser().Id, form.verificationCode).then(() => {
            renderListPhotos();
        });
    });
}
function renderCreateProfil() {
    noTimeout(); // ne pas limiter le temps d’inactivité 
    eraseContent(); // effacer le conteneur #content 
    updateHeader("Inscription", "createProfil"); // mettre à jour l’entête et menu
    $("#newPhotoCmd").hide(); // camoufler l’icone de commande d’ajout de photo
    $("#content").append(`
    <form class="form" id="createProfilForm">
        <fieldset>
            <legend>Adresse ce courriel</legend>
            <input type="email"
                class="form-control Email"
                name="Email"
                id="Email"
                placeholder="Courriel"
                required
                RequireMessage = ' Veuillez entrer votre courriel'
                InvalidMessage='Courriel invalide'
                CustomErrorMessage="Ce courriel est déjà utilisé" />
            <input class="form-control MatchedInput"
                type="text"
                matchedInputId="Email"
                name="matchedEmail"
                id="matchedEmail"
                placeholder="Vérification"
                required
                RequireMessage='Veuillez entrez de nouveau votre courriel'
                InvalidMessage="Les courriels ne correspondent pas" />
        </fieldset>
        <fieldset>
            <legend>Mot de passe</legend>
            <input type="password"
                class="form-control"
                name="Password"
                id="Password"
                placeholder="Mot de passe"
                required
                RequireMessage='Veuillez entrer un mot de passe'
                InvalidMessage='Mot de passe trop court' />
            <input class="form-control MatchedInput"
                type="password"
                matchedInputId="Password"
                name="matchedPassword"
                id="matchedPassword"
                placeholder="Vérification"
                required
                InvalidMessage="Ne correspond pas au mot de passe" />
        </fieldset>
        <fieldset>
            <legend>Nom</legend>
            <input type="text"
                class="form-control Alpha"
                name="Name"
                id="Name"
                placeholder="Nom"
                required
                RequireMessage='Veuillez entrer votre nom'
                InvalidMessage='Nom invalide' />
        </fieldset>
        <fieldset>
            <legend>Avatar</legend>
            <div class='imageUploader'
                newImage='true'
                controlId='Avatar'
                imageSrc='images/no-avatar.png'
                waitingImage="images/Loading_icon.gif">
            </div>
        </fieldset>
        <input type='submit'
            name='submit'
            id='saveUserCmd'
            value="Enregistrer"
            class="form-control btn-primary">
    </form>
    <div class="cancel">
        <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
    </div>
    `);
    $('#loginCmd').on("click", async function () {
        renderLogin();
    });
    initFormValidation();
    initImageUploaders();
    $('#abortCmd').on("click", async function () {
        renderLogin();
    });
    // ajouter le mécanisme de vérification de doublon de courriel 
    addConflictValidation(API.checkConflictURL(), 'Email', 'saveUser');
    // call back la soumission du formulaire 
    $('#createProfilForm').on("submit", function (event) {
        let profil = getFormData($('#createProfilForm'));
        delete profil.matchedPassword;
        delete profil.matchedEmail;
        event.preventDefault();// empêcher le fureteur de soumettre une requête de soumission 
        showWaitingGif(); // afficher GIF d’attente 
        API.register(profil); // commander la création au service API
        renderLogin("Votre compte a été créé. Veuillez prendre vos courriels pour récupérer votre code de vérification qui vous sera demandé lors de votre prochaine connexion.");
    });
}
function renderEditProfil() {
    let loggedUser = API.retrieveLoggedUser();
    noTimeout();
    eraseContent();
    updateHeader("Profil", "editProfil");
    $("#newPhotoCmd").hide();
    $("#content").append(
        $(`
            <form class="form" id="editProfilForm">
                <input type="hidden" name="Id" id="Id" value="${loggedUser.Id}"/>
                <fieldset>
                    <legend>Adresse ce courriel</legend>
                    <input type="email"
                        class="form-control Email"
                        name="Email"
                        id="Email"
                        placeholder="Courriel"
                        required
                        RequireMessage = ' Veuillez entrer votre courriel'
                        InvalidMessage='Courriel invalide'
                        CustomErrorMessage="Ce courriel est déjà utilisé"
                        value="${loggedUser.Email}">
                    <input class="form-control MatchedInput"
                        type="text"
                        matchedInputId="Email"
                        name="matchedEmail"
                        id="matchedEmail"
                        placeholder="Vérification"
                        required
                        RequireMessage='Veuillez entrez de nouveau votre courriel'
                        InvalidMessage="Les courriels ne correspondent pas"
                        value="${loggedUser.Email}">
                </fieldset>
                <fieldset>
                    <legend>Mot de passe</legend>
                    <input type="password"
                        class="form-control"
                        name="Password" id="Password"
                        placeholder="Mot de passe"
                        InvalidMessage='Mot de passe trop court'>
                    <input class="form-control MatchedInput"
                        type="password"
                        matchedInputId="Password"
                        name="matchedPassword"
                        id="matchedPassword"
                        placeholder="Vérification"
                        InvalidMessage="Ne correspond pas au mot de passe">
                </fieldset>
                <fieldset>
                    <legend>Nom</legend>
                    <input type="text"
                        class="form-control Alpha"
                        name="Name"
                        id="Name"
                        placeholder="Nom"
                        required
                        RequireMessage='Veuillez entrer votre nom'
                        InvalidMessage='Nom invalide'
                        value="${loggedUser.Name}">
                </fieldset>
                <fieldset>
                    <legend>Avatar</legend>
                    <div class='imageUploader'
                        newImage='false'
                        controlId='Avatar'
                        imageSrc='${loggedUser.Avatar}'
                        waitingImage="images/Loading_icon.gif">
                    </div>
                </fieldset>
                <input type='submit'
                    name='submit'
                    id='saveUserCmd'
                    value="Enregistrer"
                    class="form-control btn-primary">
            </form>
            <div class="cancel">
                <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
            </div>
            <div class="cancel">
                <hr> <button class="form-control btn-warning" id="deleteCmd">Effacer le compte</button>
            </div>
        `));
    $('#loginCmd').on("click", async function () {
        renderLogin();
    });
    initFormValidation();
    initImageUploaders();
    $('#abortCmd').on("click", async function () {
        renderLogin();
    });
    $('#deleteCmd').on('click', renderDelete);
    addConflictValidation(API.checkConflictURL(), 'Email', 'saveUser');
    $('#editProfilForm').on("submit", function (event) {
        let profil = getFormData($('#editProfilForm'));
        delete profil.matchedPassword;
        delete profil.matchedEmail;
        event.preventDefault();
        showWaitingGif();
        API.modifyUserProfil(profil).then(() => {
            renderEditProfil();
        });
    });
}
async function renderDelete(user = null) {
    timeout();
    eraseContent();
    updateHeader("Retrait de compte", "delete");
    $("#newPhotoCmd").hide();
    if (user == null) {

        $("#content").append(
            $(`
            <div class="content" style="text-align:center">
            <div class="form">
            <h3>Voulez-vous vraiment effacer votre compte?</h3>
            </div>
            <div class="form">
            <button class="form-control btn-danger" id="deleteCmd">Effacer mon compte</button>
            </div>
            <div class="cancel">
            <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
            </div>
            </div>
        `));
        $('#deleteCmd').on("click", async function () {
            API.unsubscribeAccount(API.retrieveLoggedUser().Id).then(() => {
                logout();
            });
        });
    } else {
        $("#content").append(
            $(`
        <div class="content" style="text-align:center">
            <div class="form">
            <h3>Voulez-vous vraiment effacer cet usager et toutes ces photos?</h3>
        </div>
        <div class="UserLayout" style="text-align:center">
            <div class="UserAvatar" style="background-image:url('${user.Avatar}')"></div>
            <div class="UserInfo">
                <span class="UserName">${user.Name}</span>
                <a href="mailto:${user.Email}" class="UserEmail" target="_blank" >${user.Email}</a>
            </div>
        </div>
        <div class="form">
        <button class="form-control btn-danger" id="deleteCmd">Effacer</button>
        </div>
        <div class="cancel">
        <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
        </div>
        </div>
    `));
        $('#deleteCmd').on("click", async function () {
            API.unsubscribeAccount(user["Id"]);
            renderListPhotos();
        });
    }
    $('#abortCmd').on("click", async function () {
        renderListPhotos();
    });
}
function renderError() {
    timeout();
    eraseContent();
    updateHeader("Problème", "error");
    $("#newPhotoCmd").hide();
    $("#content").append(
        $(`
        <div class="content" style="text-align:center">
            <div class="form">
                <h3><span style='color:red'>Le serveur ne répond pas</span></h3>
            </div>
            <hr>
            <div class="form">
                <button class="form-control btn-primary" id="loginCmd">Connexion</button>
            </div>
        </div>
        `));
    $('#loginCmd').on("click", async function () {
        renderLogin();
    });
}
function renderUser(contact) {
    let adminAccessToogle;
    let userBlockToogleButton;

    if (contact.Authorizations["readAccess"] == 2 && contact.Authorizations["writeAccess"] == 2){
        adminAccessToogle = `<span class="removeAdminCmd dodgerblueCmd fas fa-user-cog" editContactId="${contact.Id}" title="Usager / promouvoir administrateur"></span>`;
    } else {
        adminAccessToogle = `<span class="addAdminCmd dodgerblueCmd fas fa-user-alt" editContactId="${contact.Id}" title="Administrateur / retirer les droits administrateur"></span>`;
    }

    if (contact.isBlocked){
        userBlockToogleButton = `<span class="removeBlockedCmd redCmd fa fa-ban" editContactId="${contact.Id}" title="Usager bloqué / débloquer l’accès"></span>`;
    } else {
        userBlockToogleButton = `<span class="addBlockedCmd fa-regular fa-circle greenCmd" editContactId="${contact.Id}" title="Usager non bloqué / bloquer l’accès"></span>`;
    }

    return $(`
     <div class="UserRow" contact_id=${contact.Id}">
        <div class="UserContainer noselect">
            <div class="UserLayout">
                 <div class="UserAvatar" style="background-image:url('${contact.Avatar}')"></div>
                 <div class="UserInfo">
                    <span class="UserName">${contact.Name}</span>
                    <a href="mailto:${contact.Email}" class="UserEmail" target="_blank" >${contact.Email}</a>
                </div>
            </div>
            <div class="UserCommandPanel">` + adminAccessToogle + userBlockToogleButton + 
                `<span class="deleteCmd goldenrodCmd fas fa-user-slash" deleteContactId="${contact.Id}" title="Effacer ${contact.Name}"></span>
            </div>
        </div>
    </div>           
    `);
}
async function Init_UI() {
    //currentETag = await Bookmarks_API.HEAD();
    renderListPhotos();
    //renderLogin();
    //start_Periodic_Refresh();
}
Init_UI();