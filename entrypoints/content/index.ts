export default defineContentScript({
  matches: ["*://www.linkedin.com/messaging/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      onMount: (container) => {
        
        function addIconToChat()
        {
            
            const chatbox = document.querySelector('.msg-form__contenteditable');
            if (chatbox) {
                
                if (!document.querySelector('#custom-icon')) {
                  //Input Button
                  const inputButton = document.createElement('button')
                  inputButton.id = 'input-button'
                  inputButton.textContent = "Input"

                  //Regenerate Button
                  const regenerateButton = document.createElement('button')
                  regenerateButton.className = 'regenerate-button'
                  regenerateButton.textContent = "Regenerate"
                  regenerateButton.disabled=true

                  //Generate Button
                  const generateButton = document.createElement('button');
                  generateButton.textContent = 'Generate Key';
                  generateButton.style.display = 'block';
                  generateButton.style.float = 'right';
                  generateButton.style.clear='right'

                  //Block on Inout and Regen. Button
                  const buttonblock = document.createElement('div')
                  buttonblock.style.display = 'none';
                  buttonblock.style.alignItems = 'end';
                  buttonblock.style.justifyContent = 'end';
                  buttonblock.style.gap = '4px'
                  buttonblock.style.width='100%'
                  
                  buttonblock.appendChild(inputButton)
                  buttonblock.appendChild(regenerateButton);

                  //Prompt Text
                  const text1 = document.createElement('p')
                  text1.id = "text1";
                  text1.style.textAlign='end'
                  text1.style.display = 'none';

                  //Reply Text
                  const text2 = document.createElement('p');
                  text2.id = "text2";
                  text2.style.textAlign='start'
                  text2.style.display = 'none';
                  text2.style.marginBottom = '2px'
                  text2.style.marginTop='2px'
                  
                  //Prompt Text Box
                  const input = document.createElement('input');
                  input.className='modal-input'
                  input.type = 'text';
                  input.placeholder = 'Enter something...';
                  input.style.marginBottom = '10px';
                  input.style.display = 'block';
                  input.style.width = '100%';


                  const modal = document.createElement('div');
                  modal.className = 'custom-modal';
                  modal.style.display = 'flex';
                  modal.style.display='column'
                  modal.style.position = 'fixed';
                  modal.style.padding = '20px';
                  modal.style.width="30%"
                  modal.style.backgroundColor = '#fff';
                  modal.style.border = '1px solid #ccc';
                  modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                  modal.style.zIndex = '1000';

                  //Modal 
                  const modalbox = document.createElement('div')
                  modalbox.id = 'modal-box'
                  modalbox.style.display = 'none'
                  modalbox.style.alignItems = 'center';
                  modalbox.style.justifyContent = 'center'
                  modalbox.style.height = '100vh';
                  modalbox.style.width = '100vw';
                  modalbox.style.position='absolute'
                  modalbox.style.left = '0';
                  modalbox.style.top = '0';
                  modalbox.style.backgroundColor = 'rgba(0,0,0,0.4)'
                  modalbox.style.zIndex='1000'

                  modal.appendChild(text1);
                  modal.appendChild(text2);
                  modal.appendChild(input);
                  modal.appendChild(buttonblock);
                  modal.appendChild(generateButton);
                  modalbox.appendChild(modal)
                  container.appendChild(modalbox);

                  //Ai icon
                  const icon = document.createElement('img');
                  icon.src = chrome.runtime.getURL('frame.png');
                  icon.id = 'custom-icon';
                  icon.alt = 'Icon';
                  icon.style.cursor = 'pointer';
                  icon.style.display = 'none';  
                  icon.style.position = 'absolute';
                  icon.style.bottom = '10px';  
                  icon.style.right = '10px';
                  icon.style.width = '20px';
                  icon.style.height = '20px';

                  
                  const chatboxContainer = chatbox.parentElement;
                  chatboxContainer.style.position = 'relative'; 
                  chatboxContainer.appendChild(icon);
                  chatbox.addEventListener('focus', () => {
                      icon.style.display = 'block';  
                  });
                  chatbox.addEventListener('blur', () => {
                    icon.style.display = 'none';  
                  });

                  icon.addEventListener('mousedown', (event) => {
                    event.preventDefault();  
                    modal.style.display = 'block';  
                    modalbox.style.display = 'flex';
                  });

                  generateButton.addEventListener('click', () => {
                    const val = input.value;
                    text1.textContent = val
                    text2.textContent = "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
                    text1.style.display = 'block';
                    text2.style.display = 'block';
                    input.value = ""
                    generateButton.style.display = 'none';
                    buttonblock.style.display = 'inline-flex';
                    // inputButton.style.display = 'block';
                    // regenerateButton.style.display = 'block';
                  });

                  inputButton.addEventListener('click', () => {
                    chatbox.firstChild.textContent = text2.textContent;
                    modal.style.display = 'none';
                    chatbox.nextElementSibling.className = 't-14 t-black--light t-normal'
                    text1.style.display = 'none';
                    text2.style.display = 'none';
                    generateButton.style.display = 'block';
                    buttonblock.style.display = 'none';
                    // inputButton.style.display = 'none';
                    // regenerateButton.style.display = 'none';
                    modalbox.style.display = 'none';
                  })

                    window.addEventListener('click', (event) => {
                        if (event.target === modalbox) {
                          modalbox.style.display = 'none';
                        }
                    });
                }
            }
        }
        window.addEventListener('load', () => {
          addIconToChat();
          const observer = new MutationObserver(debounce(addIconToChat, 300));
          observer.observe(document.body, { childList: true, subtree: true });
        });
      },
    })
    ui.mount();
  },
});

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}