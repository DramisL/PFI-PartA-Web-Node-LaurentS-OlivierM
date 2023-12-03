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
        API.logout().then(() => {
            renderLogin();
        });
    });
    $('#editProfilMenuCmd').on("click", async function () {
        saveContentScrollPosition();
        renderEditProfile();
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
function renderManageUser() {
    timeout();
    eraseContent();
    updateHeader("Gestion des usagers", "manageUser");
    $("#newPhotoCmd").hide();
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
                    Auteur: Nicolas Chourot
                </p>
                <p>
                    Collège Lionel-Groulx, automne 2023
                </p>
            </div>
        `));
}
function renderLogin(loginMessage = "") {
    noTimeout();
    eraseContent();
    updateHeader("Connexion", "connect");
    $("#newPhotoCmd").hide();
    let Email = EmailError = passwordError = "";
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
        API.login(profil.Email, profil.Password).then(() => {
            console.log(API.currentStatus);
            switch (API.currentStatus) {
                case 0:
                    renderListPhotos();
                    break;
                case 480:
                    renderCodeVerification();
                    break;
                case 481:
                    EmailError = "Courriel introuvable";
                    break;
                case 482:
                    passwordError = "Mot de passe incorrect";
                    break;
            }
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
    $('#loginCmd').on('click', renderLogin); // call back sur clic
    initFormValidation();
    initImageUploaders();
    $('#abortCmd').on('click', renderLogin); // call back sur clic
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
    //need to get loggedUser
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
                <hr> <a href="confirmDeleteProfil.php">
                    <button class="form-control btn-warning">Effacer le compte</button>
                </a>
            </div>
        `));
    $('#loginCmd').on('click', renderLogin);
    initFormValidation();
    initImageUploaders();
    $('#abortCmd').on('click', renderLogin);
    addConflictValidation(API.checkConflictURL(), 'Email', 'saveUser');
    $('#editProfilForm').on("submit", function (event) {
        let profil = getFormData($('#editProfilForm'));
        delete profil.matchedPassword;
        delete profil.matchedEmail;
        event.preventDefault();
        showWaitingGif();
        modifyUserProfil(profil);
    });
}
function renderError() {
    timeout();
    eraseContent();
    updateHeader("Problème", "error");
    $("#newPhotoCmd").hide();
    $("#content").append(
        $(`
            
        `))
}
async function Init_UI() {
    //currentETag = await Bookmarks_API.HEAD();
    renderListPhotos();
    //start_Periodic_Refresh();
}
Init_UI();