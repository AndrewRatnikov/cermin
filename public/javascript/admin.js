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
            this.$changeLabels = $('[data-target="#update-label"]');
            this.$updateLabelModal = $('#update-label');
            this.$delLabelInput = $('#del-label');
            this.$delLabelBtn = $('#del-label-btn');
            this.$addLabelInput = $('#add-label');
            this.$addLabelBtn = $('#add-label-btn');
        },
        bindEvents: function () {
            this.$uploadPostPreviewInput.on('change', this.setFilenames.bind(this));
            this.$addPostForm.on('submit', this.addNewPost.bind(this));
            this.$closeAlertMessageInAddPost.on('click', this.closeAlertMessageInAddPost.bind(this));
            this.$changeLabels.on('click', this.clearModalErr.bind(this));
            this.$delLabelBtn.on('click', this.delLabel.bind(this));
            this.$addLabelBtn.on('click', this.addLabel.bind(this));
        },
        addLabel: function (event) {
            const label = this.$addLabelInput.val().trim();
            if (!label) this.prependAlertDangerBlock(this.$updateLabelModal.find('.modal-body'), 'Previously fill input field');
            this.postHandler({ label: this.$addLabelInput.val(), new: true }, 'Label is added');
        },
        delLabel: function (event) {
            const label = this.$addLabelInput.val().trim();
            if (!label) this.prependAlertDangerBlock(this.$updateLabelModal.find('.modal-body'), 'Previously choose label');
            this.postHandler({ label: this.$delLabelInput.val(), new: false }, 'Label is deleted');
        },
        postHandler: function (data, msg) {
            this.clearModalErr();
            $.post('/admin/updateLabel', data, this.resultHandler.bind(this, msg));
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
        prependAlertDangerBlock: function (block, msg) {
            block.prepend(`<p class="alert alert-danger">${msg}</p>`)
        },
        clearModalErr: function () {
            this.$updateLabelModal.find('.alert').remove();
            this.$delLabelInput.val('');
            this.$addLabelInput.val('');
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
        },
        bindEvents: function () {
            this.$delPost.on('click', this.deletePost.bind(this));
            this.$editPost.on('click', this.editPost.bind(this));
        },
        render: function () {
            this.$imgWrap.slick({
                infinite: true,
                speed: 300,
                variableWidth: true
            });
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
        editPost: function (event) {
            //      TODO: add edit post
            console.log('edit');
        },
    };
    postsActions.init();

});