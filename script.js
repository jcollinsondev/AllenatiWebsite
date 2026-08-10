window.addEventListener("scroll", () => {
    const scale = 1 - window.scrollY / 1000;
    const opacity = 1 - window.scrollY / 800;

    document.documentElement.style.setProperty(
        "--scroll-scale",
        scale
    );

    document.documentElement.style.setProperty(
        "--scroll-opacity",
        opacity
    );
});