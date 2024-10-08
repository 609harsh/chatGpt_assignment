import './styles.css';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';


let generateButton = ``

let testbutton=`<div>
		<button className="input-button"style="background-color:blue; color:white; display:none;">Input</button>
		<button className="regenerate-button"style="background-color:blue; color:white; display:none;" disabled>Regenerate</button>	
	</div>`



export default defineContentScript({
  matches: ["*://www.linkedin.com/*"],
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
                  
                  const inputButton = document.createElement('button')
                  // inputButton.style.display='none'
                  inputButton.id = 'input-button'
                  inputButton.textContent = "Input"

                  const regenerateButton = document.createElement('button')
                  regenerateButton.className = 'regenerate-button'
                  regenerateButton.textContent = "Regenerate"
                  // regenerateButton.style.display = 'none';
                  regenerateButton.disabled=true

                  const generateButton = document.createElement('button');
                  generateButton.textContent = 'Generate Key';
                  generateButton.style.display = 'block';
                  generateButton.style.float = 'right';
                  generateButton.style.clear='right'

                  const buttonblock = document.createElement('div')
                  buttonblock.style.display = 'none';
                  buttonblock.style.alignItems = 'end';
                  buttonblock.style.justifyContent = 'end';
                  buttonblock.style.gap = '4px'
                  buttonblock.style.width='100%'
                  
                  // buttonblock.appendChild(generateButton)
                  buttonblock.appendChild(inputButton)
                  buttonblock.appendChild(regenerateButton);
                  
                  

                  const text1 = document.createElement('p')
                  text1.id = "text1";
                  text1.style.textAlign='end'
                  text1.style.display = 'none';

                  const text2 = document.createElement('p');
                  text2.id = "text2";
                  text2.style.textAlign='start'
                  text2.style.display = 'none';
                  text2.style.marginBottom = '2px'
                  text2.style.marginTop='2px'
                  
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
                  
                  
                  
                  // document.body.appendChild(modal);

                  const icon = document.createElement('img');
                  icon.src = chrome.runtime.getURL(`frame.png`);
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
          const observer = new MutationObserver(addIconToChat);
          observer.observe(document.body, { childList: true, subtree: true });
        });
      },
    });

    
    ui.mount();

  },
});