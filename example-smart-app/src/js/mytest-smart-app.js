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
        var mo = smart.patient.api.search({type: 'MedicationOrder'});

        $.when(pt, mo).fail(onError);

        $.when(pt, mo).done(function(patient) {
          var fullName = '';
          var fname = '';
          var lname = '';

          if (typeof patient.name[0] !== 'undefined') {
            fname = patient.name[0].given.join(' ');
            lname = patient.name[0].family.join(' ');            
          }
          
          if (typeof mo.status[0] !== 'undefined') {
            p.meds =  mo.status[0];          
          }          

          var p = defaultPatient();
          p.fullName = fname.concat(" ",lname);
          
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
      meds: {value: ''}      
    };
  }

  
  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
    $('#fullname').html(p.fullName);
    $('#meds').html(p.meds);
    
  };

})(window);
