
const homeHandler = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to AuthSphere API",
        version: "2.4.0-stable",
        documentation: "https://authsphere.vercel.app/docs",
        status: "Service is running smooth 🚀",
        endpoints: {
            health: "/health",
            auth: "/api/v1/auth",
            developers: "/api/v1/developers",
            projects: "/api/v1/projects"
        }
    });
};

export default homeHandler;
