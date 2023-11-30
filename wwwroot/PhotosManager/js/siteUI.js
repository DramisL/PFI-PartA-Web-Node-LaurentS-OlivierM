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
function updateHeader(title, id) {
    let loggedUser;
    /*loggedUser = { Id: 1, Name: "Olivier Morin", Email: "", Avatar: "images/no-avatar.png" }*//*Remplacer par get user*/
    
    $("#header").html(
        $(`
            <span title="Liste des photos" id="listPhotosCmd"> <img src="images/PhotoCloudLogo.png" class="appLogo"></span>
            <span class="viewTitle">`+ title
            + (id == "listPhotos" ? `<div class="cmdIcon fa fa-plus" id="newPhotoCmd" title="Ajouter une photo"></div>` : "") +
            `</span>
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
        `))
}
function updateDropDownMenu() {
    let DDMenu = $("#DDMenu");
    DDMenu.empty();
    DDMenu.append($(`
        <span class="dropdown-item" id="loginCmd"><i class="menuIcon fa fa-sign-in mx-2"></i>Connexion</span>
    `));
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
        renderListPhotos();
    });
    $('#loginCmd').on("click", async function () {
        renderConnect();
    });
    $('#logout').on("click", async function () {
        //logout()?
    });
    $('#editProfilMenuCmd').on("click", async function () {
        renderEditProfile();
    });
    $('#listPhotosMenuCmd').on("click", async function () {
        renderListPhotos();
    });
    $('#aboutCmd').on("click", function () {
        renderAbout();
    });
}
function renderListPhotos() {
    pageManager(0, "Liste des photos", "listPhotos");

    $("#content").append(
        $(`
            
        `))
}
function renderManageUser() {
    pageManager(0, "Gestion des usagers", "manageUser");

    $("#content").append(
        $(`
            
        `))
}
function renderAbout() {
    pageManager(0, "À propos...", "about");
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
function renderConnect() {
    pageManager(1, "Connexion", "connect");
    let loginMessage = Email = EmailError = passwordError = "";
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
        renderCreateProfile();
    });
}
function renderEditProfile() {
    renderProfileForm(null /*Remplacer par get user*/, "Profil", "editProfile");
}
function renderCreateProfile() {
    renderProfileForm({ Id: 0, Name: "", Email: "", Avatar: "images/no-avatar.png" }, "Inscription", "createProfile");
}
function renderProfileForm(loggedUser, headerName, headerId) {
    pageManager(1, headerName, headerId);
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
        `))
}
function renderError() {
    pageManager(1, "Problème", "error");

    $("#content").append(
        $(`
            
        `))
}
function pageManager(timeoutType, headerName, headerId) {
    switch (timeoutType) {
        case 0:
            timeout();
            break;
        case 1:
            noTimeout();
            break;
        case 2:
            initTimeout();
            break;
        default:
            timeout();
    }
    timeout();
    saveContentScrollPosition();
    eraseContent();
    updateHeader(headerName, headerId);
    updateDropDownMenu();
}
async function Init_UI() {
    //currentETag = await Bookmarks_API.HEAD();
    renderListPhotos();
    //start_Periodic_Refresh();
}
Init_UI();