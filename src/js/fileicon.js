function fileicon(name, v){
	const images = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.avif'];
            const audios = ['.mp3', '.wav', '.ogg', '.aac', '.flac', '.m4a', '.wma', '.alac', '.aiff', '.opus'];
            const executaves = ['.exe', '.msi', '.bat', '.cmd', '.sh', '.bin', '.app', '.jar', '.com', '.scr'];
            const videos = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.mpeg', '.3gp', '.m4v'];
            const js = ['.js', '.jsx', '.ts','.tsx'];
            const css = ['.css', '.scss', '.sass', '.less', '.styl'];
            const html = ['.htm', '.html'];
            const compress = ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.lz', '.iso', '.arj', '.cab', '.ace'];
            const pdf = ['.pdf'];
            
            var extension = name.substring(name.lastIndexOf('.')).toLowerCase();

            var icone;
            if(images.includes(extension)){
                icone = `<div class="file-item-img" style="background-image: url(${v.file});"></div>`;  
            }else if(audios.includes(extension)){
                icone = `<div class="file-item-icon far fa-file-audio text-secondary"></div>`;
            }else if(executaves.includes(extension)){
                icone = ` <div class="file-item-icon fas fa-window-restore text-secondary"></div>`;
            }else if(videos.includes(extension)){
                icone = `<div class="file-item-icon far fa-file-video text-secondary"></div>`;
            }else if(js.includes(extension)){
                icone = ` <div class="file-item-icon fab fa-js text-secondary"></div>`;
            }else if(css.includes(extension)){
                icone = `<div class="file-item-icon fab fa-css3-alt text-secondary"></div>`;
            }else if(html.includes(extension)){
                icone = `<div class="file-item-icon fab fa-html5 text-secondary"></div>`;
            }else if(compress.includes(extension)){
                icone = ` <div class="file-item-icon far fa-file-archive text-secondary"></div>`;
            }else if(pdf.includes(extension)){
                icone = ` <div class="file-item-icon far fa-file-pdf text-secondary"></div>`;
            }else{
                icone = `<div class="file-item-icon fas fa-file text-secondary"></div>`;
            }


   	return icone;
}