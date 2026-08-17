
  // prepare data
  vcalendar = new ICAL.Component(ICAL.parse(cal_data));

  res =
  {
    uid :
      vcalendar
        .getAllSubcomponents()
        .map(function (x) { return x.getFirstPropertyValue('uid'); }),

    summary :
      vcalendar
        .getAllSubcomponents()
        .map(function (x) { return x.getFirstPropertyValue('summary'); }),

    start :
      {
        timestamp:
          vcalendar
            .getAllSubcomponents()
            .map(function (x) { return x.getFirstPropertyValue('dtstart'); })
            .map(function (x) { return new Date(x).getTime()/1000; })
      },

    end:
      {
        timestamp:
          vcalendar
            .getAllSubcomponents()
            .map(function (x) { return x.getFirstPropertyValue('dtend'); })
            .map(function (x) { return new Date(x).getTime()/1000; })
      },

    description :
      vcalendar
        .getAllSubcomponents()
        .map(function (x) { return x.getFirstPropertyValue('description'); }),

    'last-modified' :
      {
        timestamp:
          vcalendar
            .getAllSubcomponents()
            .map(function (x) { return x.getFirstPropertyValue('last-modified'); })
            .map(function (x) { return new Date(x).getTime()/1000; })
      },

    'status' :
      vcalendar
        .getAllSubcomponents()
          .map(function (x) { return x.getFirstPropertyValue('status'); }),

    'who' :
      vcalendar
        .getAllSubcomponents()
          .map(function (x) {

	      a = x.getAllProperties('attendee');
	      if(a === null)
		  return "";
	      txt = "";
	      a.forEach(function(at) {
		  txt += at.getParameter('cn') + ", ";
	      });
	      return txt;
	  })      
  }
