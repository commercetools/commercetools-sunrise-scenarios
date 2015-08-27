package io.commercetools.sunrise.steps;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import static java.util.stream.Collectors.toList;

public class Main {
    public static void main(String[] args) throws Throwable {
        final List<String> usedArgsList = new LinkedList<>();
        usedArgsList.add("--glue");
        usedArgsList.add("io.commercetools.sunrise.steps");
        //Ignores all scenarios or features tagged with @ignore
        usedArgsList.add("--tags");
        usedArgsList.add("~@wip");
        if (args.length == 0) {
            usedArgsList.add("classpath:features");
        }
        usedArgsList.addAll(Arrays.stream(args).map(entry -> "src/main/resources/features/" + entry).collect(toList()));
        final String[] argumentsForCucumber = new String[usedArgsList.size()];
        usedArgsList.toArray(argumentsForCucumber);

        cucumber.api.cli.Main.main(argumentsForCucumber);
    }
}
