module.exports = {

    registerValidate: (req, res, next) => {
        const user = req.body;
        if (!user.name) {
            return res.send({message: "No username", success: false, data: null});
        }
        if (user.name.length < 4 || user.name.length > 20)
            return res.send({message: "Username must be between 4 and 20 characters long", success: false, data: null});
        if (user.email.length < 4 || user.email.length > 30)
            return res.send({message: "Email must be between 4 and 30 characters long", success: false, data: null});
        if (!user.password) {
            return res.send({message: "No password", success: false, data: null});
        }

        if (user.password < 6 || user.password > 20)
            return res.send({message: "Password must be between 4 and 20 characters long", success: false, data: null});

        const hasUppercase = /[A-Z]/.test(user.password);
        if (!hasUppercase) {
            return res.send({
                message: "Password must include at least one uppercase letter",
                success: false,
                data: null
            });
        }
        const hasSpecialSymbol = /[!@#$%^&*_+]/.test(user.password);
        if (!hasSpecialSymbol) {
            return res.send({
                message: "Password must include at least one special symbol (!@#$%^&*_+)",
                success: false,
                data: null
            });
        }
        next()
    },
    loginValidate: (req, res, next) => {
        const {email, password} = req.body;

        if (!email) {
            return res.send({message: "No email", success: false, data: null});
        }
        if (!password) {
            return res.send({message: "No password", success: false, data: null});
        }

        if ( email.length > 30)
            return res.send({message: "Bad credentials", success: false, data: null});

        if (password.length < 6 || password.length > 20)
            return res.send({
                message: "Bad credentials",
                success: false,
                data: null
            });
        const validateEmail =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!validateEmail) {
            return res.send({
                message: "Invalid email format",
                success: false,
                data: null
            });
        }
        next()
    },
}
