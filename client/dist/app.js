(function () {
  // everything API related
  var API = {};

  // your API URL from Amazon API Gateway (important: without a trailing '/')
  API.rootUrl = 'https://example.com/foo/bar';

  // NOTE: this function was used multiple times for simplicity sake (e.g. when updating a note).
  // you should avoid this in a production environment as it adds up costs for the usage of the API gateway.
  API.getAllNotes = function () {
    $.ajax({
      type: 'GET',
      url: API.rootUrl + '/notes',
      contentType: 'application/json',
      success: function (data, textStatus, xhr) {
        if (textStatus === 'success') {
          rerenderNotesList(data.notes);
        } else {
          showFlash('An error occurred while loading the notes. Please try again');
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        showFlash('An error occurred while loading the notes: ' + textStatus)
      }
    });
  };

  API.createNote = function (body) {
    var data = {
      note: {
        body: body
      }
    };
    if (body.length !== 0) {
      $.ajax({
        type: 'POST',
        url: API.rootUrl + '/notes',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data, textStatus, xhr) {
          if (textStatus === 'success') {
            clearTextarea();
            API.getAllNotes();
          } else {
            showFlash('An error occurred while creating the note. Please try again');
          }
        },
        error: function (xhr, textStatus, errorThrown) {
          showFlash('An error ocurred while creating your note: ' + textStatus);
        }
      });
    } else {
      showFlash('Body should not be blank');
    }
  };

  API.updateNote = function (id, body) {
    var data = {
      note: {
        body: body
      }
    }
    if (body.length !== 0) {
      if (id.length !== 0) {
        $.ajax({
          type: 'PUT',
          url: API.rootUrl + '/notes/' + id,
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: function (data, textStatus, xhr) {
            if (textStatus === 'success') {
              clearTextarea();
              API.getAllNotes();
            } else {
              showFlash('An error occurred while updating your note. Please try again');
            }
          },
          error: function (xhr, textStatus, errorThrown) {
            showFlash('An error ocurred while updating your note: ' + textStatus);
          }
        });
      } else {
        showFlash('Id should not be blank');
      }
    } else {
      showFlash('Body should not be blank');
    }
  };

  API.destroyNote = function (id) {
    if (id.length !== 0) {
      $.ajax({
        type: 'DELETE',
        url: API.rootUrl + '/notes/' + id,
        contentType: 'application/json',
        success: function (data, textStatus, xhr) {
          if (textStatus === 'success') {
            $('[data-id=selected-note-id]').val('');
            API.getAllNotes();
          } else {
            showFlash('An error occurred while deleting the note. Please try again');
          }
        },
        error: function (xhr, textStatus, errorThrown) {
          showFlash('An error ocurred while deleting the note: ' + textStatus);
        }
      });
    } else {
      showFlash('Id should not be blank');
    }
  };

  // frontend DOM manipulations
  var rerenderNotesList = function (notes) {
    var html = ''
    if (notes.length !== 0) {
      html = '<ul>';
      notes.forEach(function (note) {
        html += '<li data-note-id="' + note.id + '""><button class="no-style delete-note-button" data-id="delete-note"><i class="fa fa-trash"></i></button><span data-id="select-note">' + note.body + '</span></li>';
      });
      html += '</ul>';
    } else {
      html += 'There are no notes available yet. Write the first one now!';
    }
    $('[data-id=dynamic-content]').html(html);
  };

  var showFlash = function (message) {
    var flashElement = $('[data-id=flash]').text(message);
    $(flashElement).toggle();
    setTimeout(function() {
        $(flashElement).toggle();
    }, 5000);
  };

  var clearTextarea = function () {
    $('[data-id=body]').val('');
    $('[data-id=selected-note-id]').val('');
  };

  // click handlers
  $('[data-id=refresh]').on('click', function () {
    API.getAllNotes();
  });

  $('[data-id=save-note]').on('click', function () {
    var selectedNoteId = $('[data-id=selected-note-id]').val();
    var body = $('[data-id=body]').val();
    if (body.length !== 0) {
      // create a new note if nothing is selected
      if (selectedNoteId.length === 0) {
        API.createNote(body);
      } else {
        API.updateNote(selectedNoteId, body);
      }
    } else {
      showFlash('Body should not be blank');
    }
  });

  $(document).on('click', '[data-id=delete-note]', function (event) {
    if (confirm('Do you really want to delete this note?')) {
      var id = ($(event.currentTarget).closest('li').data('note-id'));
      if (id.length !== 0) {
        API.destroyNote(id);
      }
    }
  });

  $(document).on('click', '[data-id=select-note]', function (event) {
    var id = ($(event.currentTarget).closest('li').data('note-id'));
    var body = ($(event.currentTarget).closest('li').text());
    $('[data-id=selected-note-id]').val(id);
    $('[data-id=body]').val(body);
  });

  $('[data-id=clear]').on('click', function () {
    clearTextarea();
  });

  // load all notes initially
  API.getAllNotes();
})();
