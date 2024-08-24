function button_upload(){
     document.querySelector('.js-upload-input').click();
}

document.querySelector('.js-upload-input').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        js_upload(this);
    }
});


function filtrarFiles(arquivo, uid, callback) {
 
    if(arquivo.type.includes('video')){
        var reader = new FileReader();
            reader.onload = function(e) {
                callback(arquivo, 'video', e.target.result, uid);
            }
            reader.readAsDataURL(arquivo);
    }else{
        var reader = new FileReader();
        reader.onload = function(e) {
           callback(arquivo, 'imagem', e.target.result, uid);
        }
        reader.readAsDataURL(arquivo);
    }

}


function js_upload(input) {
    $('.js-card-upload-temp .js-progressbar').show();

    for (var [k, v] of Object.entries(input.files)) {
        var porcentagemDesejada = 1000;
        console.log(input)
        var uid = jsencoder.encode(v.name)
       
        var prog = `
            <div class="js-card-upload-temp" id="${uid}">
                <div class="js-preview-temp"></div>
                <div class="js-progressbar">
                    <div class="js-prog-barra"></div>
                </div>
            </div>`;

        $(".js-uploads").append(prog);

        filtrarFiles(v, uid,  function(novoArquivo, type, preview, uids) {

            if(type == 'video'){

                var video = `<video width="100%" height="100%">
                                <source src="" type="video/mp4">
                            </video>`;

                $(".js-uploads #"+uids+" .js-preview-temp").html(video);
                $(".js-uploads #"+uids+" .js-preview-temp video").find('source').attr('src', preview);
                $(".js-uploads #"+uids+" .js-preview-temp video").get(0).load();
               

            }else{
                $(".js-uploads #" + uids + ' .js-preview-temp').css('background-image', `url(${preview})`);
            }


            var form_data = new FormData();
            form_data.append('file', novoArquivo);
            form_data.append('filename', novoArquivo.name);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://host-js.jsaplication.workers.dev/upload', true);
            xhr.upload.addEventListener('progress', function(event) {
                if (event.lengthComputable) {
                    var percentComplete = (event.loaded / event.total) * 100;

                    
                   

                    $(".js-uploads #" + uids + ' .js-prog-barra').css('width', percentComplete + '%');
                    
                    if (percentComplete === 100) {
                        //$(".js-uploads #" + uids + ' .js-progressbar').hide();
                        $(".js-uploads #" + uids).remove();
                    }
                }
            }, false);

            xhr.onload = function() {
                if (xhr.status === 200) {
                    var resp = JSON.parse(xhr.responseText);
                    console.log('resp:', resp);

                    if(resp.status =="success"){

                        carregarFiles();

                    }

                } else {
                    console.log('Erro ao carregar o arquivo:', xhr.statusText);
                }
            };

            xhr.onerror = function() {
                console.log('Erro ao carregar o arquivo:', xhr.statusText);
            };

            xhr.send(form_data);
        });
    }
}

function  button_newfolder(){
    var nome = 'New Folder';
    $.post("https://host-js.jsaplication.workers.dev/create/",{
        name: "pasta"
    }, function(resp){
        if(resp.status == 'success'){
            carregarFiles();
        }
    })
}


function carregarFiles(folder){
 $.get("https://host-js.jsaplication.workers.dev/files",{
    folder: folder
 }, function(resp){
    console.log(resp);

    if(resp.length == 0){

    }else{
        $(".loadfiles").html('');

        const pastas = new Set();

        for(var[k,v] of Object.entries(resp)){
           
            var name = v.file.split('/')[4];
            var icone = fileicon(name, v);
            
            var cards;
            var nomef = 1;

            var active = $("#routes .active").attr('id');
            var subfolder = jsencoder.encode(v.name.split('/')[0]+v.date);
           
            // console.log(v.folder);

            if(v.folder == ''){
                cards = `<div class="file-item">
                                        <div class="file-item-select-bg bg-primary"></div>
                                        <label class="file-item-checkbox custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" />
                                            <span class="custom-control-label"></span>
                                        </label>
                                        ${icone}
                                        <a href="javascript:void(0)" class="file-item-name">
                                            ${name}
                                        </a>
                                        <div class="file-item-changed">02/20/2018</div>
                                        <div class="file-item-actions btn-group">
                                            <button type="button" class="btn btn-default btn-sm rounded-pill icon-btn borderless md-btn-flat hide-arrow dropdown-toggle" data-toggle="dropdown"><i class="ion ion-ios-more"></i></button>
                                            <div class="dropdown-menu dropdown-menu-right">
                                                <a class="dropdown-item" href="javascript:void(0)">Rename</a>
                                                <a class="dropdown-item" href="javascript:void(0)">Move</a>
                                                <a class="dropdown-item" href="javascript:void(0)">Copy</a>
                                                <a class="dropdown-item" href="javascript:void(0)" onclick="deleteFolder(this)" name="${v.folder}">Excluir</a>
                                            </div>
                                        </div>
                                    </div>`;
                $(".loadfiles").append(cards);

            }else{
                if(!pastas.has(v.folder)){
                    
                    cards = `<div class="file-item">
                                        <div class="file-item-select-bg bg-primary"></div>
                                        <label class="file-item-checkbox custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" />
                                            <span class="custom-control-label"></span>
                                        </label>
                                        <div onclick="openFolder(this)" name="${v.folder}" data="${v.date}">
                                        <div class="file-item-icon far fa-folder text-secondary"></div>
                                        <a href="javascript:void(0)" class="file-item-name">
                                            ${v.folder}
                                        </a>
                                        </div>
                                        <div class="file-item-changed">02/20/2018</div>
                                        <div class="file-item-actions btn-group">
                                            <button type="button" class="btn btn-default btn-sm rounded-pill icon-btn borderless md-btn-flat hide-arrow dropdown-toggle" data-toggle="dropdown"><i class="ion ion-ios-more"></i></button>
                                            <div class="dropdown-menu dropdown-menu-right">
                                                <a class="dropdown-item" href="javascript:void(0)">Rename</a>
                                                <a class="dropdown-item" href="javascript:void(0)">Move</a>
                                                <a class="dropdown-item" href="javascript:void(0)">Copy</a>
                                                <a class="dropdown-item" href="javascript:void(0)" onclick="deleteFolder(this)" name="${v.folder}">Excluir</a>
                                            </div>
                                        </div>
                                    </div>`;
                    $(".loadfiles").append(cards);
                    pastas.add(v.folder);
                }
            }
           
           
            
        }
    }
 })

}


// function carregarFilesFolder(folder){
//  $.get("https://host-js.jsaplication.workers.dev/subfiles",{
//     folder: folder
//  }, function(resp){
//     console.log(resp);

//     if(resp.length == 0){

//     }else{
//         $(".loadfiles").html('');

//         const pastas = new Set();

//         for(var[k,v] of Object.entries(resp)){
           
//             var name = v.file.split('/')[4];
//             var icone = fileicon(name, v);
            
//             var cards;
//             var nomef = 1;

//             var active = $("#routes .active").attr('id');
//             var subfolder = jsencoder.encode(v.name.split('/')[0]+v.date);
           
//             console.log(v.folder);

//             if(v.folder == ''){
//                 console.log('log1');
//                 cards = `<div class="file-item">
//                                         <div class="file-item-select-bg bg-primary"></div>
//                                         <label class="file-item-checkbox custom-control custom-checkbox">
//                                             <input type="checkbox" class="custom-control-input" />
//                                             <span class="custom-control-label"></span>
//                                         </label>
//                                         ${icone}
//                                         <a href="javascript:void(0)" class="file-item-name">
//                                             ${name}
//                                         </a>
//                                         <div class="file-item-changed">02/20/2018</div>
//                                         <div class="file-item-actions btn-group">
//                                             <button type="button" class="btn btn-default btn-sm rounded-pill icon-btn borderless md-btn-flat hide-arrow dropdown-toggle" data-toggle="dropdown"><i class="ion ion-ios-more"></i></button>
//                                             <div class="dropdown-menu dropdown-menu-right">
//                                                 <a class="dropdown-item" href="javascript:void(0)">Rename</a>
//                                                 <a class="dropdown-item" href="javascript:void(0)">Move</a>
//                                                 <a class="dropdown-item" href="javascript:void(0)">Copy</a>
//                                                 <a class="dropdown-item" href="javascript:void(0)" onclick="deleteFolder(this)" name="${v.folder}">Excluir</a>
//                                             </div>
//                                         </div>
//                                     </div>`;
//                 $(".loadfiles").append(cards);

//             }else{
//                 console.log('log2')
//                 if(!pastas.has(v.folder)){
                    
//                     cards = `<div class="file-item">
//                                         <div class="file-item-select-bg bg-primary"></div>
//                                         <label class="file-item-checkbox custom-control custom-checkbox">
//                                             <input type="checkbox" class="custom-control-input" />
//                                             <span class="custom-control-label"></span>
//                                         </label>
//                                         <div onclick="openFolder(this)" name="${v.folder}" data="${v.date}">
//                                         <div class="file-item-icon far fa-folder text-secondary"></div>
//                                         <a href="javascript:void(0)" class="file-item-name">
//                                             ${v.folder}
//                                         </a>
//                                         </div>
//                                         <div class="file-item-changed">02/20/2018</div>
//                                         <div class="file-item-actions btn-group">
//                                             <button type="button" class="btn btn-default btn-sm rounded-pill icon-btn borderless md-btn-flat hide-arrow dropdown-toggle" data-toggle="dropdown"><i class="ion ion-ios-more"></i></button>
//                                             <div class="dropdown-menu dropdown-menu-right">
//                                                 <a class="dropdown-item" href="javascript:void(0)">Rename</a>
//                                                 <a class="dropdown-item" href="javascript:void(0)">Move</a>
//                                                 <a class="dropdown-item" href="javascript:void(0)">Copy</a>
//                                                 <a class="dropdown-item" href="javascript:void(0)" onclick="deleteFolder(this)" name="${v.folder}">Excluir</a>
//                                             </div>
//                                         </div>
//                                     </div>`;
//                     $(".loadfiles").append(cards);
//                     pastas.add(v.folder);
//                 }
//             }
           
           
            
//         }
//     }
//  })

// }


function deleteFolder(e){
    var name = $(e).attr('name');
    console.log('folder',name);

    $.post("https://host-js.jsaplication.workers.dev/deleteFolder",{
        folder: name
    }, function(resp){
        if(resp.status == 'success'){
            carregarFiles();
        }
    })

}
function home(){
    carregarFiles('');
    $("#routes").html('')
    $("#routes").html(` <li class="breadcrumb-item" onclick="home()" >
                <a href="javascript:void(0)">home</a>
            </li>`)
}
function openFolder(e){
    var name = $(e).attr('name');
    var data = $(e).attr('data');
    
    var uid = jsencoder.encode(name+data);
    console.log(name, data, uid);

    var listRoutes = $("#routes .breadcrumb-item");
    // console.log(listRoutes);


    for(var[k,v] of Object.entries(listRoutes)){

        var id = $(v).attr('id');
        if(id === uid){
            $("#"+uid).remove();
        }
    }

    var newroutes = ` <li class="breadcrumb-item active" id="${uid}">
                <a href="javascript:void(0)" >${name}</a>
            </li>`;

    $("#routes").append(newroutes);


  

 carregarFiles(name)
    // carregarFilesFolder(name)
}

function downloadFile(fileUrl, fileName) {
            // Fetch the file
            fetch(fileUrl)
                .then(response => response.blob())
                .then(blob => {
                    // Create a temporary URL for the blob
                    const url = URL.createObjectURL(blob);

                    // Create a link element
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = fileName;

                    // Add the link to the DOM
                    document.body.appendChild(link);

                    // Click the link to start the download
                    link.click();

                    // Clean up
                    URL.revokeObjectURL(url);
                    document.body.removeChild(link);
                })
                .catch(error => console.error('Erro ao baixar o arquivo:', error));
}


carregarFiles('');