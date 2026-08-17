library(ical)
js = readLines("cal.js")
body(ical_parse)[[5]][[2]] = js

if(FALSE) {
    ical_parse_df =
        function(f)
            as.data.frame(ical_parse(f))
} else {

    # or put the modified local ical_parse
    ns = getNamespace("ical")
    fn = "ical_parse"
    unlockBinding(fn, ns)
    environment(ical_parse) = ns
    assign(fn, ical_parse, envir = ns)
    lockBinding(fn, ns)
    rm(ical_parse, js)

}
