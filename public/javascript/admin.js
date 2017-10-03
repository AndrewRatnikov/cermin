$(function() {

    const profileActions = {
        init: function() {
            this.cacheDom();
            this.bindEvents();
        },
        cacheDom: function() {
            this.$uploadAvatarInput = $('#upload-avatar');
            this.$modalChangeAvatar = $('#change-avatar');
            this.$changeAvatarForm = this.$modalChangeAvatar.find('form');
            this.$changePersonalDataPopup = $('#change-personal-data');
            this.$changePersonalDataForm = this.$changePersonalDataPopup.find('form');
            this.$changePasswordPopup = $('#change-password');
            this.$changePasswordForm = this.$changePasswordPopup.find('form');
            this.$oldPasswordInput = $('#old-password');
            this.$newPasswordInput = $('#new-password');
            this.$confirmPasswordInput = $('#confirm-new-password');
        },
        bindEvents: function () {
            this.$uploadAvatarInput.on('change', this.setValueToInput.bind(this));
            this.$uploadAvatarInput.on('click', this.delErrorBlock.bind(this));
            this.$modalChangeAvatar.on('hidden.bs.modal', this.clearInputValue.bind(this));
            this.$changeAvatarForm.on('submit', this.sendNewAvatar.bind(this));
            this.$changePersonalDataForm.on('submit', this.sendPersonalData.bind(this));
            this.$changePasswordForm.on('submit', this.sendChangePassword.bind(this));
        },
        delErrorBlock: function (event) {
            this.$changeAvatarForm.find('.alert').remove();
        },
        setValueToInput: function (event) {
            this.$changeAvatarForm.find('.alert').remove();
            const filename = this.$uploadAvatarInput.prop('files')[0].name;
            this.$changeAvatarForm.find('[type="text"]').val(filename);
        },
        clearInputValue: function (event) {
            this.$changeAvatarForm.find('.alert').remove();
            this.$changeAvatarForm.find('input').val('');
        },
        sendNewAvatar: function (event) {
            event.preventDefault();
            const url = this.$changeAvatarForm.attr('action');
            const files = this.$uploadAvatarInput.prop('files');
            const modalBody = this.$changeAvatarForm.find('.modal-body');
            if (!files.length) {
                return this.resultHandler(modalBody, { error: 'No files were upload' });
            }
            const formData = new FormData();
            $.each(files, function(key, value) {
                formData.append('uploadAvatar', value);
            });
            $.ajax({
                url: url,
                contentType: false,
                processData: false,
                data: formData,
                type: 'post',
                success: this.resultHandler.bind(this, modalBody)
            });
        },
        sendPersonalData: function(event) {
            event.preventDefault();
            const url = this.$changePersonalDataForm.attr('action');
            const data = this.$changePersonalDataForm.serialize();
            const modalBody = this.$changePersonalDataForm.find('.modal-body');
            $.post(url, data, this.resultHandler.bind(this, modalBody));
        },
        sendChangePassword: function(event) {
            event.preventDefault();
            const url = this.$changePasswordForm.attr('action');
            const data = {
                oldPassword: this.$oldPasswordInput.val(),
                newPassword: this.$newPasswordInput.val(),
                confirmNewPassword: this.$confirmPasswordInput.val()
            };
            const modalBody = this.$changePasswordForm.find('.modal-body');
            if (data.newPassword !== data.confirmNewPassword ) return this.resultHandler(modalBody, { error: 'Confirm your new password' });
            $.post(url, data, this.resultHandler.bind(this, modalBody));
        },
        resultHandler: function (modalBody, result) {
            if (result.success) return document.location.reload(true);
            const err = '<p class="alert alert-danger">' + result.error + '</p>';
            modalBody.prepend(err);
        }
    };
    profileActions.init();

    const addPostActions = {
        init: function() {
            this.cacheDom();
            this.bindEvents();
        },
        cacheDom: function () {
            this.$addPostForm = $('#add-post');
            this.$uploadPostPreviewInput = $('#upload-post-preview');
            this.$imagesNamesInput = $('#image-names');
            this.$postTitleInput= $('#post-title');
            this.$postLabelInput= $('#post-label');
            this.$postTextInput= $('#post-text');
            this.$alertMessageInAddPost = $('#alert-message');
            this.$closeAlertMessageInAddPost = $('#close-alert-message');
        },
        bindEvents: function () {
            this.$uploadPostPreviewInput.on('change', this.setFilenames.bind(this));
            this.$addPostForm.on('submit', this.addNewPost.bind(this));
            this.$closeAlertMessageInAddPost.on('click', this.closeAlertMessageInAddPost.bind(this));
        },
        setFilenames: function (event) {
            this.hideNewPostMessage();
            const filenames = [];
            $.each(this.$uploadPostPreviewInput.prop('files'), (index, element) => {
                filenames.push(element.name);
            });
            this.$imagesNamesInput.val(filenames.join(', '));
        },
        addNewPost: function (event) {
            event.preventDefault();
            const url = this.$addPostForm.attr('action');
            const files = this.$uploadPostPreviewInput.prop('files');
            const formData = new FormData();
            $.each(files, (key, value) => {
                formData.append('uploadPostPreview', value);
            });
            formData.append(this.$postTitleInput.attr('name'), this.$postTitleInput.val());
            formData.append(this.$postLabelInput.attr('name'), this.$postLabelInput.val());
            formData.append(this.$postTextInput.attr('name'), this.$postTextInput.val());
            $.ajax({
                url: url,
                contentType: false,
                processData: false,
                data: formData,
                type: 'post'
            }).done(this.addNewPostHandler.bind(this));
        },
        addNewPostHandler: function(result) {
            if (result.success) {
                this.$alertMessageInAddPost.removeClass('hidden').find('.alert').addClass('alert-success').prepend(result.message);
                this.$imagesNamesInput.val('');
                this.$postTitleInput.val('');
                this.$postLabelInput.val('');
                this.$postTextInput.val('');
            } else {
                this.$alertMessageInAddPost.removeClass('hidden').find('.alert').addClass('alert-danger').prepend(result.error);
            }
        },
        closeAlertMessageInAddPost: function () {
            this.hideNewPostMessage();
        },
        hideNewPostMessage: function() {
            this.$alertMessageInAddPost.addClass('hidden').find('.alert').removeClass('alert-danger alert-success').contents().filter(() => this.nodeType === 3).remove();
        },
    };
    addPostActions.init();

    const postsActions = {
        init: function() {
            this.cacheDom();
            this.bindEvents();
            this.render();
        },
        cacheDom: function () {
            this.$imgWrap = $('.post__img-wrap');
            this.$delPost = $('.del-post');
            this.$editPost = $('.edit-post');
            this.$updatePostModal = $('#update-post');
            this.$updatePostForm = this.$updatePostModal.find('form');
            this.$imagesNamesInput = $('#image-names');
            this.$uploadPostPreview = $('#upload-post-preview');
            this.uploadedImg = $('.img-wrap');
            this.delImgBtn = this.uploadedImg.find('.btn');
            this.postTittle = $('#post-title');
            this.postLabel = $('#post-label');
            this.postText = $('#post-text');
        },
        bindEvents: function () {
            this.$delPost.on('click', this.deletePost.bind(this));
            this.$editPost.on('click', this.getModalEditPost.bind(this));
            this.$updatePostForm.on('submit', this.editPost.bind(this));
        },
        bindModalEvents: function () {
            this.$uploadPostPreview.on('change', this.setFilenames.bind(this));
            this.delImgBtn.on('click', this.onDeleteImg.bind(this));
        },
        render: function () {
            this.$imgWrap.slick({
                infinite: true,
                speed: 300,
                variableWidth: true
            });
        },
        setFilenames: function (event) {
            const filenames = [];
            $.each(this.$uploadPostPreview.prop('files'), (index, element) => {
                filenames.push(element.name);
            });
            this.$imagesNamesInput.val(filenames.join(', '));
        },
        onDeleteImg: function (event) {
            const btn = $(event.target);
            const imgWrap = btn.parents('.img-wrap');
            const img = imgWrap.find('img');
            const alert = imgWrap.find('.alert');
            let imgIsDel;
            if (img.data('deleted') === 'true') {
                imgIsDel = 'false';
                imgWrap.find('.alert').hide('fast', () => {
                    alert.next().show();
                });
            }  else {
                imgIsDel = 'true';
                btn.hide('fast', () => {
                    alert.show();
                });
            };
            img.data('deleted', imgIsDel);
        },
        deletePost: function (event) {
            const $post = $(event.target).parents('.post');
            $post.find('.alert').remove();
            const postId = $post.data('postid');
            const url = `/admin/delpost/${postId}`;
            $.post(url, function(result) {
                if (result.success) {
                    $post.hide('slow', () => $post.remove());
                } else {
                    $post.find('.post__btns').before(`<p class="alert alert-danger">${result.error}</p>`);
                }
            });
        },
        getModalEditPost: function (event) {
            const $post = $(event.target).parents('.post');
            $post.find('.alert').remove();
            const postId = $post.data('postid');
            $.post('/admin/profile/updatePostModal', { postId: postId }, function(result) {
                if (result.success) {
                    this.$updatePostForm.find('.modal-body').html(result.html);
                    this.$updatePostForm.data('postid', postId);
                    this.cacheDom();
                    this.bindModalEvents();
                } else {
                    $post.find('.post__btns').before(`<p class="alert alert-danger">${result.error}</p>`);
                }
            }.bind(this));
        },
        editPost: function (event) {
            event.preventDefault();
            const data = new FormData();
            const postId = this.$updatePostForm.data('postid');
            $.each(this.$uploadPostPreview.prop('files'), function(key, element) {
                data.append('uploadPostPreview', element);
            });
            const leavedFiles = [];
            this.uploadedImg.each((index, element) => {
                if ( !$(element).find('img').data('deleted') ) leavedFiles.push($(element).find('img').attr('src'));
            });
            const authorEnd = window.location.pathname.lastIndexOf('/');
            const authorStart = window.location.pathname.lastIndexOf('/', authorEnd - 1);
            const author = window.location.pathname.substring(authorStart + 1, authorEnd);
            data.append('author', author);
            data.append('leavedImg', leavedFiles);
            data.append('postId', postId);
            data.append('title', this.postTittle.val());
            data.append('label', this.postLabel.val());
            data.append('text', this.postText.val());
            $.ajax({
                url: '/admin/profile/updatePost',
                contentType: false,
                processData: false,
                type: 'post',
                data: data
            }).done((result) => {

            });
        }
    };
    postsActions.init();

    const changeLabelModalActions = {
        init: function () {
            this.cacheDom();
            this.bindEvents();
        },
        cacheDom: function () {
            this.$postLabelInput= $('#post-label');
            this.$updateLabelModal = $('#update-label');
            this.$delLabelInput = $('#del-label');
            this.$delLabelBtn = $('#del-label-btn');
            this.$addLabelInput = $('#add-label');
            this.$addLabelBtn = $('#add-label-btn');
        },
        bindEvents: function () {
            this.$updateLabelModal.on('show.bs.modal', this.clearModalErr.bind(this));
            this.$delLabelBtn.on('click', this.delLabel.bind(this));
            this.$addLabelBtn.on('click', this.addLabel.bind(this));
        },
        delLabel: function (event) {
            const label = this.$delLabelInput.val().trim();
            if (!label) this.prependAlertDangerBlock(this.$updateLabelModal.find('.modal-body'), 'Previously choose label');
            this.postHandler({ label: label, new: false }, 'Label is deleted');
        },
        addLabel: function (event) {
            const label = this.$addLabelInput.val().trim();
            if (!label) this.prependAlertDangerBlock(this.$updateLabelModal.find('.modal-body'), 'Previously fill input field');
            this.postHandler({ label: this.$addLabelInput.val(), new: true }, 'Label is added');
        },
        postHandler: function (data, msg) {
            $.post('/admin/updateLabel', data, this.resultHandler.bind(this, msg));
            this.clearModalErr();
        },
        prependAlertDangerBlock: function (block, msg) {
            block.prepend(`<p class="alert alert-danger">${msg}</p>`)
        },
        clearModalErr: function () {
            this.cacheDom();
            this.$updateLabelModal.find('.alert').remove();
            this.$delLabelInput.val('');
            this.$addLabelInput.val('');
        },
        resultHandler: function (msg, result) {
            const $modalBody = this.$updateLabelModal.find('.modal-body');
            if (result.success) {
                $modalBody.prepend(`<p class="alert alert-success">${msg}</p>`);
                if (result.added) {
                    this.$delLabelInput.append(`<option value="${result.label}">${result.label}</option>`);
                    this.$postLabelInput.append(`<option value="${result.label}">${result.label}</option>`);
                } else {
                    this.$delLabelInput.find(`[value="${result.label}"]`).remove();
                    this.$postLabelInput.find(`[value="${result.label}"]`).remove();
                }
            } else {
                this.prependAlertDangerBlock($modalBody, result.error);
            }
        },
    };
    changeLabelModalActions.init()

});