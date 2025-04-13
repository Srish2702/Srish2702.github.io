(function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Navigation
    const $navLinks = $('.nav-link');
    const $sections = $('.section');
    
    function setActiveTab(tabId) {
        // Update navigation
        $navLinks.each(function() {
            $(this).toggleClass('active', $(this).data('tab') === tabId);
        });
    
        // Update sections
        $sections.each(function() {
            $(this).toggleClass('active', $(this).attr('id') === tabId);
        });
    }
    
    $navLinks.on('click', function() {
        setActiveTab($(this).data('tab'));
    });
    
    // Portfolio Modal
    const $modal = $('#portfolio-modal');
    const $modalBody = $modal.find('.modal-body');
    const $closeModal = $modal.find('.close-modal');
    
    const portfolioData = [];
    
    
    // $(document).on('click', '.portfolio-item', function() {
    //     showModal($(this).data('id'));
    // });
    function showModal(id) {
        const data = portfolioData.find(item => item.id == id);
        if (!data) {
            showToast("Something went wrong", 4000, 'error');;
            return;
        }
    
        let processHtml = '';
            processHtml += `
                <div>
                    <p class="text-gray-300">${data.info}</p>
                </div>
            `;
    
        $modalBody.html(`<div class="space-y-8">${processHtml}</div>`);
    
        $modal.addClass('active');
    }
    
    $closeModal.on('click', function() {
        $modal.removeClass('active');
    });
    
    $modal.on('click', function(e) {
        if ($(e.target).is($modal)) {
            $modal.removeClass('active');
        }
    });
    
    // Contact Form
    const $contactForm = $('#contact-form');
    
    $contactForm.submit(function(e) {
        e.preventDefault();
        $('.submit-btn').attr('disabled', true);
        
        let name = $("#name").val().trim();
        let email = $("#email").val().trim();
        let message = $("#message").val().trim();

        if((!name || !email || !message) || name.length < 3 || email.length < 3 || message.length < 5) {
            showToast("All Fields Are Required", 4000, 'info');
            return;
        }
        
        showToast("Please wait, Message Sending...", 4000, 'info');

        $.ajax({
            url: 'https://srishti.raju.serv00.net/api/contect-me',
            type: 'POST',
            data: {
                name,
                email,
                message
            },
            // contentType: 'application/json',
            success: function(response) {
                if(response.status) {
                    showToast("Message sent successfully! Thank You For contect me.", 4000, 'success');
                } else {
                    showToast(response.message, 4000, 'error');
                }
            },
            error: function(error) {
                showToast("Something went wrong!", 4000, 'error');
            }
        });
        // Add your form submission logic here
        $contactForm[0].reset();

        $('.submit-btn').removeAttr('disabled');

    });
    
    $(document).ready(function() {
        const $firstTab = $('.nav-link[data-tab="about"]');
        if ($firstTab.length) {
            $firstTab.addClass('active');
        }

        const $tabs = $('.nav-link');
        $tabs.on('click', function() {
            $tabs.removeClass('active');

            $(this).addClass('active');
            const $sections = $('.section');
            $sections.removeClass('active');

            const tabName = $(this).data('tab');
            const $activeSection = $('#' + tabName);
            if ($activeSection.length) {
                $activeSection.addClass('active');
            }
        });
    
        $.ajax({
            url: 'https://srishti.raju.serv00.net/api/about',
            type: 'get',
            success: function(response) {
                const container = $('.about-me');
                container.empty();
                container.append('<h2>About Me</h2><div class="typing-text"></div>');
        
                const htmlString = response;
                const tempDiv = $('<div>').html(htmlString);
                const elements = tempDiv.contents();
        
                function typeElement(index) {
                    if (index >= elements.length) return;
        
                    const el = elements[index];
                    const $el = $(el).clone();
                    $('.typing-text').append($el);

                    const content = $el.text();
                    $el.empty();
        
                    let charIndex = 0;
                    function typeChar() {
                        if (charIndex < content.length) {
                            $el.append(content.charAt(charIndex));
                            charIndex++;
                            setTimeout(typeChar, 10);
                        } else {
                            typeElement(index + 1);
                        }
                    }
                    typeChar();
                }
        
                typeElement(0);
            }
        });
        $.ajax({
            url: 'https://srishti.raju.serv00.net/api/feedbacks',
            type: 'get',
            success: function(response) {
                const data = response.data;
                const $portfolioGrid = $('.testimonials-grid');
                let portfolioHtml = '';
                portfolioData.push(...data);
                data.forEach(function(item) {
                    $portfolioGrid.append(`
                        <div class="testimonial-card">
                        ${item.message}
                        <div class="testimonial-author">
                            <img src="${item.img}" 
                                 alt="${item.name}">
                            <div>
                                <strong>${item.name}</strong>
                                <span>${item.deg}</span>
                            </div>
                        </div>
                    </div>
                    `);
                });
            }
        });
        $.ajax({
            url: 'https://srishti.raju.serv00.net/api/portfolio',
            type: 'get',
            success: function(response) {
                const data = response.data;
                const $portfolioGrid = $('.portfolio-grid');
                let portfolioHtml = '';
                portfolioData.push(...data);
                data.forEach(function(item) {
                    $portfolioGrid.empty();
                    $portfolioGrid.append(`
                        <div class="portfolio-item" data-id="${item.id}">
                            <img src="${item.coverpic}" alt="image is Loading...">
                            <!-- <div class="portfolio-overlay">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="eye" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            </div> -->
                        </div>
                    `);
                });
            }
        });
    });

    function showToast(message, duration = 3000, type = 'info') {
        const toast = document.getElementById("toast");
        const toastMessage = document.getElementById("toast-message");

        toastMessage.textContent = message;
        toast.classList.add('show', type); 
        toast.style.visibility = "visible";

        setTimeout(() => {
            toast.classList.remove('show', type);
            toast.style.visibility = "hidden";
        }, duration);
    }
})()