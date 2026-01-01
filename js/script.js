 const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
      const header = item.querySelector(".faq-header");
      const body = item.querySelector(".faq-body");
      const icon = item.querySelector(".faq-icon");

      header.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");

        if (isOpen) {
          item.classList.remove("open");
          body.style.maxHeight = null;
          icon.textContent = "+";
        } else {
          item.classList.add("open");
          body.style.maxHeight = body.scrollHeight + "px";
          icon.textContent = "−"; // minus
        }
      });
    });