(function(window){
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    function onReady(smart)  {
      if (smart.hasOwnProperty('patient')) {
        var patient = smart.patient;
        var pt = patient.read();
        var meds = smart.patient.api.search({type: 'MedicationOrder'});

        $.when(pt).fail(onError);

        $.when(pt).done(function(patient) {
          var fullName = '';
          var fname = '';
          var lname = '';

          if (typeof patient.name[0] !== 'undefined') {
            fname = patient.name[0].given.join(' ');
            lname = patient.name[0].family.join(' ');            
          }          

          var p = defaultPatient();
          p.fullName = fname.concat(" ",lname);
          //p.meds = meds[0].medication;
          ret.resolve(p);
        });
      } else {
        onError();
      }
    }

    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();

  };

  function defaultPatient(){
    return {
      fullName: {value: ''},
      //meds: {value: ''}      
    };
  }

  
  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
    $('#fullname').html(p.fullName);
    
  };

})(window);
