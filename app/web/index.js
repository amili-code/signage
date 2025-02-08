const { verifyToken } = require('../config/auth');

class Web {
    renderPage(req, res, page, options = {}) {
        const result = verifyToken(req.session.token);
        if (result.login) {
            res.render(page, { name: result.name, email: result.email, ...options });
        } else {
            res.render("login", { text: 'برای دسترسی به امکانات باید ابتدا وارد شوید' });
        }
    }

    root(req, res) { this.renderPage(req, res, "root"); }
    addUser(req, res) { this.renderPage(req, res, "addUser"); }
    listUser(req, res) { this.renderPage(req, res, "listUser"); }
    addVideo(req, res) { this.renderPage(req, res, "addVideo"); }
    listVideo(req, res) { this.renderPage(req, res, "listVideo"); }
    addPlaylist(req, res) { this.renderPage(req, res, "addPlaylist"); }
    listPlaylist(req, res) { this.renderPage(req, res, "listPlaylist"); }
    specialPlaylist(req, res) { this.renderPage(req, res, "specialPlaylist"); }
    addPlayer(req, res) { this.renderPage(req, res, "addPlayer"); }
    listPlayer(req, res) { this.renderPage(req, res, "listPlayer"); }
    setting(req, res) { this.renderPage(req, res, "setting"); }
    newsPlaylist(req, res) { this.renderPage(req, res, "newsPlaylist"); }
    newsVideos(req, res) { this.renderPage(req, res, "newsVideos"); }
    newsUser(req, res) { this.renderPage(req, res, "newsUser"); }

    login(req, res) { res.render("login", {}); }
    register(req, res) { res.render("register", {}); }
}

module.exports = new Web();
