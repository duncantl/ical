js = readLines("~/Personal/Calendar/cal.js");
body(ical_parse)[[5]][[2]] = js

b2 = as.data.frame(ical_parse(f))
