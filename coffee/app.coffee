$ ->
    delay = (ms, func) -> setTimeout func, ms
    
    yam.getLoginStatus (response) ->
        if response.authResponse
            pending_attachments = []
            attachments = []
            all_messages = []
 
            $('body').on 'change', 'input[name=pending_attachment]', (e) ->
                return false if attachments.length > 20

                _data = new FormData()
                _data.append 'attachment', e.target.files[0]

                $('.post').append '<p id="pending" class="upload">in upload...</p><div class="progressbar"><p class="bar"></p></div>'
                yam.platform.request
                    xhr: () ->
                        xhr = new window.XMLHttpRequest()
                        xhr.upload.addEventListener 'progress', (evt) ->
                            if evt.lengthComputable
                                $('#pending').next().children '.bar' 
                                    .css 'width', '' + (100 * evt.loaded / evt.total) + '%' 
                        , false
                        xhr.addEventListener 'progress', (evt) ->
                            if evt.lengthComputable
                                $('#pending').next().children '.bar' 
                                    .css 'width', '' + (100 * evt.loaded / evt.total) + '%' 
                        , false
                        xhr
                    url: "pending_attachments",
                    contentType: "multipart/form-data",
                    data: _data,
                    processData: false,
                    contentType: false,
                    type: "POST",
                    dataType: "json",
                    success: (data) ->
                        $('#pending').html '<p><i class="fa fa-check" aria-hidden="true"></i>' + data.original_name + ' successfully uploaded!</p>'
                        $('#pending').removeAttr 'id'
                        pending_attachments.push data.id
                    ,
                    error: (error) ->
                        console.log error
                false

    $('input[name=get_attachment]').on 'click', (e) ->
        e.preventDefault();
        $('#contextMenu').css { 'top': e.pageY, 'left': e.pageX }
            .animate { height: 'toggle' }, 500

    $('#local_upload').click () ->
        $('input[name=pending_attachment]').trigger 'click'
        $('#contextMenu').animate { height: 'toggle' }, 500

    $('body').on 'click', '.reply-button', () ->
        parent = $(this).parent()
        createReplyInput parent, 'reply-input'

    createReplyInput '#feed', false