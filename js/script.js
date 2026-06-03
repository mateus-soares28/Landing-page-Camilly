document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasGsap = typeof gsap !== "undefined";
    const hasScrollTrigger = typeof ScrollTrigger !== "undefined";
    const hasScrollSmoother = typeof ScrollSmoother !== "undefined";
    const hasSplitText = typeof SplitText !== "undefined";
    let smoother = null;

    if (hasGsap && hasScrollTrigger) {
        const plugins = [ScrollTrigger];

        if (hasScrollSmoother) plugins.push(ScrollSmoother);
        if (hasSplitText) plugins.push(SplitText);

        gsap.registerPlugin(...plugins);

        if (!prefersReducedMotion && hasScrollSmoother) {
            smoother = ScrollSmoother.create({
                wrapper: "#smooth-wrapper",
                content: "#smooth-content",
                smooth: 1.1,
                effects: true,
                smoothTouch: 0.1
            });
        }
    }

    const scrollToTarget = (targetElement) => {
        if (smoother) {
            smoother.scrollTo(targetElement, true, "top top");
            return;
        }

        window.scrollTo({
            top: targetElement.offsetTop,
            behavior: "smooth"
        });
    };

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href").substring(1);
            if (!targetId) return;

            const targetElement = document.getElementById(targetId);
            if (targetElement) scrollToTarget(targetElement);
        });
    });

    const scrollArrow = document.querySelector(".scroll-arrow");

    if (scrollArrow) {
        scrollArrow.addEventListener("click", () => {
            if (smoother) {
                smoother.scrollTo(window.scrollY + window.innerHeight * 0.8, true);
                return;
            }

            window.scrollBy({
                top: window.innerHeight * 0.8,
                behavior: "smooth"
            });
        });
    }

    if (hasGsap && hasScrollTrigger && !prefersReducedMotion) {
        const revealLines = document.querySelectorAll(
            ".overline .line, .divider-icon, .card-divider, .card-divider-small"
        );

        revealLines.forEach(line => {
            gsap.timeline({
                scrollTrigger: {
                    trigger: line,
                    start: "top 90%",
                    once: true
                }
            }).from(line, {
                autoAlpha: 0,
                scaleX: 0,
                transformOrigin: "center center",
                duration: 1.35,
                ease: "power4.out"
            });
        });

        const cardGroups = document.querySelectorAll(".cards-grid, .results-grid");

        cardGroups.forEach(group => {
            const cards = group.querySelectorAll(".card, .result-card");

            gsap.timeline({
                scrollTrigger: {
                    trigger: group,
                    start: "top 82%",
                    once: true
                }
            }).from(cards, {
                autoAlpha: 0,
                y: 58,
                duration: 1.25,
                ease: "power4.out",
                stagger: 0.18
            });
        });

        gsap.utils.toArray(".bottom-banner, .contact-form, .contact-image-wrapper, .contact-badge").forEach(card => {
            gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: "top 86%",
                    once: true
                }
            }).from(card, {
                autoAlpha: 0,
                y: 46,
                duration: 1.2,
                ease: "power4.out"
            });
        });

        const textSelector = [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "p",
            "a",
            "button",
            "li",
            ".logo-title",
            ".logo-subtitle",
            ".overline span",
            ".title-sobre",
            ".section-overline",
            ".contact-overline",
            ".card-pill",
            ".card-top-badge",
            ".ba-labels span",
            ".badge-logo",
            ".badge-name",
            ".badge-text"
        ].join(", ");

        const ignoredTextParents = [
            "[aria-hidden='true']",
            ".icon-placeholder",
            ".input-icon",
            ".social-icon",
            ".footer-icon",
            ".select-arrow",
            ".lock-icon"
        ].join(", ");

        const textElements = [];

        gsap.utils.toArray(textSelector).forEach(element => {
            if (!element.textContent.trim()) return;
            if (element.closest(".site-footer")) return;
            if (element.closest(ignoredTextParents)) return;
            if (textElements.some(parent => parent.contains(element))) return;

            textElements.push(element);
        });

        textElements.forEach(textElement => {
            const shouldSplitText = hasSplitText && !textElement.matches("p, li, a, button");

            if (shouldSplitText) {
                const split = SplitText.create(textElement, {
                    type: "lines, chars",
                    linesClass: "gsap-text-line"
                });

                gsap.set(split.lines, {
                    display: "block",
                    overflow: "hidden"
                });

                gsap.timeline({
                    scrollTrigger: {
                        trigger: textElement,
                        start: "top 88%",
                        once: true
                    }
                }).from(split.chars, {
                    autoAlpha: 0,
                    yPercent: 65,
                    duration: 1.15,
                    ease: "power4.out",
                    stagger: {
                        each: 0.015,
                        from: "start"
                    }
                });
                return;
            }

            gsap.timeline({
                scrollTrigger: {
                    trigger: textElement,
                    start: "top 88%",
                    once: true
                }
            }).from(textElement, {
                autoAlpha: 0,
                y: 28,
                duration: 1.15,
                ease: "power4.out"
            });
        });

        ScrollTrigger.refresh();
    }

    const contactForm = document.getElementById("contact-form");
    const ownerWhatsapp = "5547996142489";

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            const formData = new FormData(contactForm);
            const selectedInterest = contactForm.elements.interest;
            const interestText = selectedInterest.options[selectedInterest.selectedIndex].text;
            const cleanValue = (value) => String(value || "").trim().replace(/\s+/g, " ");

            const message = [
                "Ola, Camilly! Vim pelo site e gostaria de agendar uma avaliacao.",
                "",
                `Nome: ${cleanValue(formData.get("name"))}`,
                `WhatsApp: ${cleanValue(formData.get("phone"))}`,
                `E-mail: ${cleanValue(formData.get("email"))}`,
                `Data de nascimento: ${cleanValue(formData.get("birthdate"))}`,
                `Interesse: ${cleanValue(interestText)}`,
                "",
                `Mensagem: ${cleanValue(formData.get("message"))}`
            ].join("\n");

            const whatsappUrl = `https://wa.me/${ownerWhatsapp}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        });
    }
});
