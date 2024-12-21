const tabs = document.querySelectorAll('.tab');
const paneles = document.querySelectorAll('.panel');
const btn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
const logo = document.getElementById('logo');


//Tabs menu event listener
tabs.forEach((tab) => tab.addEventListener('click', onTabClick));

//Hambuger button listener
btn.addEventListener('click', navToggle);

function onTabClick(e) {
    // Deactivate all tabs
    tabs.forEach((tab) => {
        tab.children[0].classList.remove(
            'border-softRed',
            'border-b-4',
            'md:border-b-0',
        );
    })
    // Hide all panels
    paneles.forEach((panel) => {
        panel.classList.add('hidden');
    })

    // Activate a new tab and panel based on the target
    e.currentTarget.children[0].classList.add('border-softRed', 'border-b-4');
    const classString = e.currentTarget.getAttribute('data-target');
    document.getElementById('panels')
        .getElementsByClassName(classString)[0] 
        .classList.remove('hidden');
}

function navToggle() {
    btn.classList.toggle('open');
    menu.classList.toggle('flex');
    menu.classList.toggle('hidden');
    
}
