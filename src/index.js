
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

// Lidar com OPTIONS para pré-vôo CORS-------------------------------------------------------------------
    const addCorsHeaders = (response) => {
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type");
      return response;
    };


    if (request.method === "OPTIONS") {
      return addCorsHeaders(new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }));
    }
//--------------------------------------------------------------------------------------------------------





// Servir arquivos estáticos do bucket R2-----------------------------------------------------------------
    if (pathname.startsWith("/static/")) {
      const filePath = pathname.slice("/static/".length);

      try {
        const object = await env.MY_BUCKET.get(filePath);

        if (!object || !object.body) {
          
          var status =  {
            status: "error",
            msg: "Arquivo não encontrado"
          }

          return addCorsHeaders(new Response(JSON.stringify(status, null, 2), {
            headers: { "Content-Type": "application/json" },
          }));


        }

        const contentType = getContentType(filePath) || "application/octet-stream";

        return addCorsHeaders(new Response(object.body, {
          headers: {
            "Content-Type": contentType,
          },
        }));
      } catch (e) {
          var status =  {
            status: "error",
            msg: "Erro ao acessar o arquivo:" + e.message
          }

          return addCorsHeaders(new Response(JSON.stringify(status, null, 2), {
            headers: { "Content-Type": "application/json" },
          }));
      }
    }
//---------------------------------------------------------------------------------------------------------






//get files list----------------------------------------------------------------------------------------------
  // if (pathname === "/files" && request.method === "GET") {
  //   try {
  //     const objects = await env.MY_BUCKET.list();

  //     // Formata a lista de arquivos e pastas
  //     const formattedFiles = objects.objects.map(object => {
  //         var directory = object.key.split("/")[0];
  //         var treeDirectore = object.key.split("/");
  //         var folde, treeD;

  //         if(directory != object.key){
  //           folde = directory;
  //           treeD = treeDirectore;
  //         }else{
  //           folde = '';
  //           treeD = [];
  //         }

  //         return {
  //           file: "https://host-js.jsaplication.workers.dev/static/" + object.key,
  //           name: object.key,
  //           size: object.size,
  //           treeDirectore: JSON.stringify(treeD),
  //           folder: folde
  //         };
  //     });

  //     return addCorsHeaders(new Response(JSON.stringify(formattedFiles, null, 2), {
  //       headers: { "Content-Type": "application/json" },
  //     }));
  //   } catch (e) {
  //       var status =  {
  //         status: "error",
  //         msg: "Erro ao listar arquivos:" + e.message
  //       }

  //       return addCorsHeaders(new Response(JSON.stringify(status, null, 2), {
  //         headers: { "Content-Type": "application/json" },
  //       }));
  //   }
  // }


  // if (pathname === "/files" && request.method === "GET") {
  //   try {
  //     // Obtém os objetos do bucket
  //     const objects = await env.MY_BUCKET.list();

  //     // Ordena os arquivos por data de upload/modificação
  //     objects.objects.sort((a, b) => {
  //       // Para ordem descendente (mais recente para mais antigo)
  //       return new Date(b.uploaded || b.last_modified) - new Date(a.uploaded || a.last_modified);
        
  //       // Para ordem ascendente (mais antigo para mais recente), inverta a ordem:
  //       // return new Date(a.uploaded || a.last_modified) - new Date(b.uploaded || b.last_modified);
  //     });

  //     // Formata a lista de arquivos e pastas
  //     const formattedFiles = objects.objects.map(object => {
  //       var directory = object.key.split("/")[0];
  //       var treeDirectore = object.key.split("/");
  //       var folde, treeD;

  //       if (directory != object.key) {
  //         folde = directory;
  //         treeD = treeDirectore;
  //       } else {
  //         folde = '';
  //         treeD = [];
  //       }

  //       return {
  //         file: "https://host-js.jsaplication.workers.dev/static/" + object.key,
  //         name: object.key,
  //         size: object.size,
  //         treeDirectore: JSON.stringify(treeD),
  //         folder: folde,
  //         date: object.uploaded || object.last_modified // Inclui a data para referência
  //       };
  //     });

  //     return addCorsHeaders(new Response(JSON.stringify(formattedFiles, null, 2), {
  //       headers: { "Content-Type": "application/json" },
  //     }));
  //   } catch (e) {
  //     var status = {
  //       status: "error",
  //       msg: "Erro ao listar arquivos:" + e.message
  //     };

  //     return addCorsHeaders(new Response(JSON.stringify(status, null, 2), {
  //       headers: { "Content-Type": "application/json" },
  //     }));
  //   }
  // }


if (pathname === "/files" && request.method === "GET") {
  try {
    const folder = new URL(request.url).searchParams.get("folder") || ""; // Obtém o parâmetro 'folder' da URL

    // Define as opções para o list, incluindo o prefixo da pasta se fornecido
    const options = folder ? { prefix: folder } : {};

    // Obtém os objetos do bucket, possivelmente filtrando pela pasta
    const objects = await env.MY_BUCKET.list(options);

    // Ordena os arquivos por data de upload/modificação
    objects.objects.sort((a, b) => {
      // Para ordem descendente (mais recente para mais antigo)
      return new Date(b.uploaded || b.last_modified) - new Date(a.uploaded || a.last_modified);
      
      // Para ordem ascendente (mais antigo para mais recente), inverta a ordem:
      // return new Date(a.uploaded || a.last_modified) - new Date(b.uploaded || b.last_modified);
    });

    // Formata a lista de arquivos e pastas
    const formattedFiles = objects.objects.map(object => {
      var directory = object.key.split("/")[0];
      var treeDirectore = object.key.split("/");
      var folde, treeD;

      if (directory != object.key) {
        folde = directory;
        treeD = treeDirectore;
      } else {
        folde = '';
        treeD = [];
      }

      return {
        file: "https://host-js.jsaplication.workers.dev/static/" + object.key,
        name: object.key,
        size: object.size,
        treeDirectore: JSON.stringify(treeD),
        folder: folde,
        date: object.uploaded || object.last_modified // Inclui a data para referência
      };
    });

    return addCorsHeaders(new Response(JSON.stringify(formattedFiles, null, 2), {
      headers: { "Content-Type": "application/json" },
    }));
  } catch (e) {
    var status = {
      status: "error",
      msg: "Erro ao listar arquivos:" + e.message
    };

    return addCorsHeaders(new Response(JSON.stringify(status, null, 2), {
      headers: { "Content-Type": "application/json" },
    }));
  }
}



//-----------------------------------------------------------------------------------------------------------


if (pathname === "/subfiles" && request.method === "GET") {
  try {
    const folder = new URL(request.url).searchParams.get("folder") || ""; // Obtém o parâmetro 'folder' da URL

    // Define as opções para o list, incluindo o prefixo da pasta se fornecido
    const options = folder ? { prefix: folder } : {};

    // Obtém os objetos do bucket, possivelmente filtrando pela pasta
    const objects = await env.MY_BUCKET.list(options);

    // Ordena os arquivos por data de upload/modificação
    objects.objects.sort((a, b) => {
      // Para ordem descendente (mais recente para mais antigo)
      return new Date(b.uploaded || b.last_modified) - new Date(a.uploaded || a.last_modified);
      
      // Para ordem ascendente (mais antigo para mais recente), inverta a ordem:
      // return new Date(a.uploaded || a.last_modified) - new Date(b.uploaded || b.last_modified);
    });

    // Formata a lista de arquivos e pastas
    const formattedFiles = objects.objects.map(object => {

      var directory = object.key.split(folder+"/")[1];

      var dd1 = directory.split('/')[0];


      var treeDirectore = dd1.split("/");
      var folde, treeD;

      if (dd1 != object.key) {
        folde = dd1;
        treeD = treeDirectore;
      } else {
        folde = '';
        treeD = [];
      }

      return {
        file: "https://host-js.jsaplication.workers.dev/static/" + object.key,
        name: object.key,
        size: object.size,
        treeDirectore: JSON.stringify(treeD),
        folder: folde,
        date: object.uploaded || object.last_modified // Inclui a data para referência
      };
    });

    return addCorsHeaders(new Response(JSON.stringify(formattedFiles, null, 2), {
      headers: { "Content-Type": "application/json" },
    }));
  } catch (e) {
    var status = {
      status: "error",
      msg: "Erro ao listar arquivos:" + e.message
    };

    return addCorsHeaders(new Response(JSON.stringify(status, null, 2), {
      headers: { "Content-Type": "application/json" },
    }));
  }
}


//-----------------------------------------------------------------------------------------------------------






//upload------------------------------------------------------------------------------------------------------
  if (pathname.startsWith("/upload") && request.method === "POST") {
    try {
      const formData = await request.formData();
      const file = formData.get("file");
      const fileName = formData.get("filename") || file.name;

      if (!file) {
          var status =  {
            status: "error",
            msg: "Arquivo não especificado"
          }

          return addCorsHeaders(new Response(JSON.stringify(status, null, 2), {
            headers: { "Content-Type": "application/json" },
          }));
      }

      const fileContent = await file.arrayBuffer();
      const fileType = file.type || "application/octet-stream";
      
      const newname = filter(fileName);
      await env.MY_BUCKET.put(newname, fileContent, {
        httpMetadata: {
          contentType: fileType,
        },
      });

      

      var status =  {
        status: "success",
        msg: "Arquivo enviado com sucesso!"
      }

      return addCorsHeaders(new Response(JSON.stringify(status, null, 2), {
         headers: { "Content-Type": "application/json" },
      }));



    } catch (e) {
        var status =  {
          status: "success",
          msg: "Erro ao enviar o arquivo: " + e.message
        }

        return addCorsHeaders(new Response(JSON.stringify(status, null, 2), {
          headers: { "Content-Type": "application/json" },
        }));

    }
  }
//-------------------------------------------------------------------------------------------------------------



//delete pastas------------------------------------------------------------------------------------------------

if (pathname === "/deleteFolder" && request.method === "POST") {
  try {
    const folder = new URL(request.url).searchParams.get("folder") || ""; // Obtém o parâmetro 'folder' da URL

    if (!folder) {
      throw new Error("Pasta não especificada" + folder);
    }

    // Obtém os objetos do bucket que têm o prefixo da pasta
    const objects = await env.MY_BUCKET.list({ prefix: folder });

    // Verifica se a pasta está vazia
    if (objects.objects.length === 0) {
      return addCorsHeaders(new Response(JSON.stringify({ status: "error", msg: "Pasta vazia ou não encontrada" }), {
        headers: { "Content-Type": "application/json" },
      }));
    }

    // Itera sobre os objetos e os exclui
    for (const object of objects.objects) {
      await env.MY_BUCKET.delete(object.key);
    }

    return addCorsHeaders(new Response(JSON.stringify({ status: "success", msg: "Pasta apagada com sucesso" }), {
      headers: { "Content-Type": "application/json" },
    }));
  } catch (e) {
    var status = {
      status: "error",
      msg: "Erro ao apagar a pasta: " + e.message
    };

    return addCorsHeaders(new Response(JSON.stringify(status, null, 2), {
      headers: { "Content-Type": "application/json" },
    }));
  }
}

//-------------------------------------------------------------------------------------------------------------




//criar pastas-------------------------------------------------------------------------------------------------
  if (pathname.startsWith("/create") && request.method === "POST") {
          const formData = await request.formData();
          const namefolder = formData.get("name");

    let folderName = namefolder;

    if (!folderName) {
      //return addCorsHeaders(new Response("Nome da pasta não fornecido", { status: 400 }));

      var status =  {
            status: "error",
            msg: "Nome da pasta não fornecido"
          }

          return addCorsHeaders(new Response(JSON.stringify(status, null, 2), {
            headers: { "Content-Type": "application/json" },
          }));


    }

    try {
      let baseFolderName = folderName;
      let suffix = 0;

      // Verifica se a pasta já existe e incrementa o nome se necessário
      while (true) {
        const folderPath = `${folderName}/`;
        const folderExists = await env.MY_BUCKET.head(folderPath).catch(() => false);

        if (!folderExists) {
          // Se a pasta não existe, crie-a
          await env.MY_BUCKET.put(folderPath, new Uint8Array(0), {
            httpMetadata: {
              contentType: 'application/octet-stream',
            },
          });

          var status = {
            status: "success",
            msg: "Folder create success"
          }

          return addCorsHeaders(new Response(JSON.stringify(status, null, 2), {
            headers: { "Content-Type": "application/json" },
          }));


        }

        // Incrementa o sufixo se a pasta já existir
        suffix++;
        folderName = `${baseFolderName} (${suffix})`;
      }
    } catch (e) {
        var status = {
              status: "error",
              msg: e.message
            }

          return addCorsHeaders(new Response(JSON.stringify(status, null, 2), {
            headers: { "Content-Type": "application/json" },
          }));
    }
  }
//------------------------------------------------------------------------------------------

    //-------------------
     var status = {
            status: "error",
            msg: "Método não suportado"
          }

        return addCorsHeaders(new Response(JSON.stringify(status, null, 2), {
          headers: { "Content-Type": "application/json" },
        }));
    
  }
};

function filter(str) {
    // Remove todos os espaços e substitui por hífens
    return str.replace(/\s+/g, '-');
}

// Função para determinar o tipo de conteúdo com base na extensão do arquivo
function getContentType(path) {
  const ext = path.split('.').pop();
  switch (ext) {
    case "html": return "text/html";
    case "css": return "text/css";
    case "js": return "application/javascript";
    case "png": return "image/png";
    case "jpg":
    case "jpeg": return "image/jpeg";
    case "gif": return "image/gif";
    case "svg": return "image/svg+xml";
    case "ico": return "image/x-icon";
    case "pdf": return "application/pdf";
    case "zip": return "application/zip";
    case "tar": return "application/x-tar";
    case "gz": return "application/gzip";
    case "csv": return "text/csv";
    case "json": return "application/json";
    case "xml": return "application/xml";
    case "mp3": return "audio/mpeg";
    case "wav": return "audio/wav";
    case "mp4": return "video/mp4";
    case "webm": return "video/webm";
    case "txt": return "text/plain";
    case "md": return "text/markdown";
    default: return "application/octet-stream";
  } 

}
