// Write JavaScript here 
$(document).ready(
    // The code starts by hiding all the time quantum elements.
    // Then it checks if the value of the input is "optRR" and shows them if so, else hides them.
    // The code shows how to hide the time quantum group.
    function() {

        $(".form-group-time-quantum").hide();

        // Show hide RR time quantum
        $('#algorithmSelector').on('change', function() {
            if (this.value === 'optRR') {
                $(".form-group-time-quantum").show(1000);
            } else {
                $(".form-group-time-quantum").hide(1000);
            }
        });

        // The code starts by checking if the inputted processID is valid.
        // If it is not, then the code sets a class on the inputted element to indicate that it's invalid.
        // The next line of code checks for an arrival time and burst time.
        // If either one is invalid, then they are set to be invalid as well.
        // $('#tblProcessList > tbody:last-child').append( ` The last part of this code creates a new row in the table with all three columns filled out with their respective values from before being changed to nulls (null values).
        // The code is a snippet of code that will be used to add a process to the table.

        var processList = [];
        var originProcessList = [];

        $('#btnAddProcess').on('click', function() {
            var processID = $('#processID');
            var arrivalTime = $('#arrivalTime');
            var burstTime = $('#burstTime');

            if (processID.val() === '' || arrivalTime.val() === '' || burstTime.val() === '') {
                processID.addClass('is-invalid');
                arrivalTime.addClass('is-invalid');
                burstTime.addClass('is-invalid');
                return;
            }

            var process = {
                processID: parseInt(processID.val(), 10),
                arrivalTime: parseInt(arrivalTime.val(), 10),
                burstTime: parseInt(burstTime.val(), 10)
            }

            processList.push(process);
            originProcessList.push(process);

            $('#tblProcessList > tbody:last-child').append(
                `<tr>
                    <td id="tdProcessID">${processID.val()}</td>
                    <td id="tdArrivalTime">${arrivalTime.val()}</td>
                    <td id="tdBurstTime">${burstTime.val()}</td>
                </tr>`
            );

            processID.val('');
            arrivalTime.val('');
            burstTime.val('');
        });


        // The code starts by checking if the inputted processID is empty or not.
        // If it's empty, then the code will add a class to the inputted element that says "is-invalid".
        // The next line of code checks if arrivalTime and burstTime are both null.
        // If they're both null, then the program will return from this function without doing anything else.
        // The next line of code creates a variable called process with some properties: processID, arrivalTime, and burstTime.
        // Then it pushes this variable onto an array called processList which is on tbody:last-child in table view.
        // Next, it appends a new row into tblProcessList where there's an ID property for each item in the list (processID) and two other properties for each item (arrival time and burst time).
        $('#btnCalculate').on('click', function() {

            if (processList.length == 0) {
                alert('Please insert some processes');
                return;
            }

            var selectedAlgo = $('#algorithmSelector').children('option:selected').val();

            if (selectedAlgo === 'optFCFS') {
                $("#tblResults td").remove(); 
                $("#ganttChart td").remove();
                firstComeFirstServed();
            }

            if (selectedAlgo === 'optSJF') {
                $("#tblResults td").remove();
                $("#ganttChart td").remove();    
                shortestJobFirst();
            }

            if (selectedAlgo === 'optSRTF') {
                $("#tblResults td").remove(); 
                $("#ganttChart td").remove();   
                shortestRemainingTimeFirst();
            }

            if (selectedAlgo === 'optRR') {
                $("#tblResults td").remove(); 
                $("#ganttChart td").remove(); 
                roundRobin();
            }
        });

        // The code starts by declaring a variable called time.
        // This is used to keep track of how long the program has been running and will be used later in the code.
        // Next, it declares two variables: queue and completedList.
        // The queue is an array that contains all of the processes that are currently being processed while completedList keeps track of which process has finished processing.
        // The first line inside the loop says "while (processList.length > 0 || queue.length > 0)".
        // This means that as long as there are still processes in either list, or if there are still items on the queue, then this loop will continue to run until they both have zero items left in them or until they both reach their maximum size (queue length).
        // Inside this loop, we start by adding one to time so we can see how much time has passed since we started running our program and then addToQueue() function runs every single iteration through this loop so it adds new processes into our list for us to process when they come back around again after their burstTime finishes up its work.
        // After adding a new process into our list with addToQueue(), we check whether its arrivalTime has already happened yet using processList[i].ar
        // The code starts with a while loop that runs until either the queue is empty or there are no more processes to run.
        // The for loop iterates through all of the processes in the queue and adds them to an array called completedList.
        // Once the process has been added, it is removed from the queue and then added back into completedList.
        function firstComeFirstServed() {
            var time = 0;
            var queue = [];
            var completedList = [];

            while (processList.length > 0 || queue.length > 0) {
                addToQueue();
                while (queue.length == 0) {
                    time++;
                    addToQueue();
                }

                // Dequeue from queue and run the process.
                process = queue.shift();
                for (var i = 0; i < process.burstTime; i++) {
                    time++
                    addToQueue();
                }
                process.completedTime = time;
                process.turnAroundTime = process.completedTime - process.arrivalTime;
                process.waitingTime = process.turnAroundTime - process.burstTime;
                completedList.push(process);
            }

            function addToQueue() {
                for (var i = 0; i < processList.length; i++) {
                    if (time >= processList[i].arrivalTime) {
                        var process = {
                            processID: processList[i].processID,
                            arrivalTime: processList[i].arrivalTime,
                            burstTime: processList[i].burstTime
                        }
                        
                        processList.splice(i, 1);
                        queue.push(process);
                    }
                }
                
            }

            // Bind table data
            var i = 0;
            $.each(completedList, function(key, process) {
                
                $('#tblResults > tbody:last-child').append(
                    `<tr>
                        <td id="tdProcessID">${process.processID}</td>
                        <td id="tdArrivalTime">${process.arrivalTime}</td>
                        <td id="tdBurstTime">${process.burstTime}</td>
                        <td id="tdBurstTime">${process.completedTime}</td>
                        <td id="tdBurstTime">${process.waitingTime}</td>
                        <td id="tdBurstTime">${process.turnAroundTime}</td>
                    </tr>`
                );
                if (i === 0)
                {
                    $('#ganttChart > tbody:last-child').append(
                        `
                            <td id="gtdBurstTime">${process.arrivalTime}</td>
                        `
                    );
                }
                $('#ganttChart > tbody:last-child').append(
                    `
                        <td id="gtdProcessID">P${process.processID}</td>
                        <td id="gtdBurstTime">${process.completedTime}</td>
                    `
                );
                i++;
                
            });
            

            // Get average
            var avgTurnaroundTime = 0;
            var avgWaitingTime = 0;
            var maxCompletedTime = 0;

            $.each(completedList, function(key, process) {
                if (process.completedTime > maxCompletedTime) {
                    maxCompletedTime = process.completedTime;
                }
                avgTurnaroundTime = avgTurnaroundTime + process.turnAroundTime;
                avgWaitingTime = avgWaitingTime + process.waitingTime;
            });

            $('#avgTurnaroundTime').val(avgTurnaroundTime / completedList.length);
            $('#avgWaitingTime').val(avgWaitingTime / completedList.length);
            $('#throughput').val(completedList.length / maxCompletedTime);

            for(var index in originProcessList){
                processList[index] = originProcessList[index];
            }
            completedList = [];

        }

        // The code is a loop that iterates through the list of processes and runs them in order.
        // The code starts by creating an empty list called completedList, which is used to keep track of which process has been run.
        // Then it creates a variable time, which will be incremented every iteration until it reaches 100 or there are no more processes left to run.
        // After that, the code creates a queue (an array) with 0 items in it so that when time reaches 100, the program will stop running and return back to where it started.
        // The next line inside the while loop is addToQueue(), which adds one item into the queue every iteration until there are no more items left in the queue.
        // The code is meant to be run in a loop and while it is running, the queue will be processed.
        // The code starts by creating an empty list called completedList which will store all the jobs that have been completed.
        // Next, time variable is created and initialized with 0.
        // The while loop starts by checking if there are any more jobs left to process or if the queue has no more items in it yet.
        // If either of those conditions are true, then addToQueue() function is executed which adds another job to the queue.
        // After adding a job to the queue, time variable increments by 1 and so does addToQueue().
        // This continues until processList length reaches 0 or there are no more items in the queue anymore.
        // Then
        //The code starts by declaring a variable called processList.
        // This is an array that will hold the processes that are waiting to be processed.
        // The code then declares a function called addToQueue().
        // This function takes in one parameter, which is the process ID of the current process being added to queue.
        // It also takes in two parameters: arrivalTime and burstTime.
        // These values represent when this particular process arrived at its destination and how long it took for this process to complete its work before returning back home again (burst time).
        // The next function declared is selectProcess().
        // This function takes in one parameter, which is the number of items currently on queue (queue length).
        // If there are no items on queue, then selectProcess() returns undefined; otherwise it selects the first item from queue with a higher burst time than arrival time.
        // The code is a sample code for a queue management system.
        // The code is to add the process to the queue.
        //The code is to select the process from the queue.

        function shortestJobFirst() {
            var completedList = [];
            var time = 0;
            var queue = [];

            while (processList.length > 0 || queue.length > 0) {
                addToQueue();
                while (queue.length == 0) {
                    time++;
                    addToQueue();
                }
                processToRun = selectProcess();
                for (var i = 0; i < processToRun.burstTime; i++) {
                    time++;
                    addToQueue();
                }
                processToRun.processID = processToRun.processID;
                processToRun.arrivalTime = processToRun.arrivalTime;
                processToRun.burstTime = processToRun.burstTime;
                processToRun.completedTime = time;
                processToRun.turnAroundTime = processToRun.completedTime - processToRun.arrivalTime;
                processToRun.waitingTime = processToRun.turnAroundTime - processToRun.burstTime;
                completedList.push(processToRun);
            }

            function addToQueue() {
                for (var i = 0; i < processList.length; i++) {
                    if (processList[i].arrivalTime === time) {
                        var process = {
                            processID: processList[i].processID,
                            arrivalTime: processList[i].arrivalTime,
                            burstTime: processList[i].burstTime
                        }
                        processList.splice(i, 1);
                        queue.push(process);
                    }
                }
            }

            function selectProcess() {
                if (queue.length != 0) {
                    queue.sort(function(a, b) {
                        if (a.burstTime > b.burstTime) {
                            return 1;
                        } else if (a.burstTime < b.burstTime) {
                            return -1;
                        }
                        else{
                            if(a.processID > b.processID){
                                return 1;
                            }
                            else{
                                return -1;
                            }
                        }
                    });
                }
                var process = queue.shift();
                return process;
            }

            // Bind table data
            var i = 0;
            $.each(completedList, function(key, process) {
                
                $('#tblResults > tbody:last-child').append(
                    `<tr>
                        <td id="tdProcessID">${process.processID}</td>
                        <td id="tdArrivalTime">${process.arrivalTime}</td>
                        <td id="tdBurstTime">${process.burstTime}</td>
                        <td id="tdBurstTime">${process.completedTime}</td>
                        <td id="tdBurstTime">${process.waitingTime}</td>
                        <td id="tdBurstTime">${process.turnAroundTime}</td>
                    </tr>`
                );
                if (i === 0)
                {
                    $('#ganttChart > tbody:last-child').append(
                        `
                            <td id="gtdBurstTime">${process.arrivalTime}</td>
                        `
                    );
                }
                $('#ganttChart > tbody:last-child').append(
                    `
                        <td id="gtdProcessID">P${process.processID}</td>
                        <td id="gtdBurstTime">${process.completedTime}</td>
                    `
                );
                i++;
                
            });

            // Get average
            var avgTurnaroundTime = 0;
            var avgWaitingTime = 0;
            var maxCompletedTime = 0;
            var throughput = 0;

            $.each(completedList, function(key, process) {
                if (process.completedTime > maxCompletedTime) {
                    maxCompletedTime = process.completedTime;
                }
                avgTurnaroundTime = avgTurnaroundTime + process.turnAroundTime;
                avgWaitingTime = avgWaitingTime + process.waitingTime;
            });

            $('#avgTurnaroundTime').val(avgTurnaroundTime / completedList.length);
            $('#avgWaitingTime').val(avgWaitingTime / completedList.length);
            $('#throughput').val(completedList.length / maxCompletedTime);

            for(var index in originProcessList){
                processList[index] = originProcessList[index];
            }
        }

        // The code starts by declaring a variable called completedList.
        //This is an array that will hold all the processes that have been completed.
        // It starts with 0 and has a length of processList.length-1, which means it can only hold one more element than there are processes in the queue.
        // The code then declares a variable called time, which is initialized to 0 at the beginning of the function and increments every iteration through while looping through processList or queue depending on what condition is true (process list length >0 or queue length >0).
        // The while loop iterates until either process list length == 0 or queue length == 0, meaning no more elements exist in either of those arrays.
        // When this happens, addToQueue() is executed to create new objects for each element in the queues and then sort them so they're sorted from highest burst time down to lowest burst time (queue[0].burstTime - 1).
        // If there's still some elements left after sorting them, selectProcessForSRTF() executes to find out which object should be selected based on their arrival times (arrivalTime) as well as their burst times (burstTime).
        // Finally runSRTF() executes when it's determined that one object should be selected
        // The code starts by creating an empty list called completedList.
        // It then creates a variable called time which will increment each time the code runs.
        // It then creates an empty array called queue, and adds to it each time the code runs until there are no more processes left in the processList or queue is empty.
        // The selectProcessForSRTF() function then sorts the list of processes from highest burstTime to lowest burstTime and returns 1 if that process is in the first position of the sorted list, -1 if that process is in second position, or 0 if there are no more processes left.
        // The runSRTF() function then increments time by one every single time it runs so that it can find out when all of the processes
        // The code starts by creating an empty array called TableData.
        // The code then loops through the table's tr elements, and for each one it creates a new object with three properties: processID, arrivalTime, and burstTime.
        // The first line of the loop is this: $('#tblProcessList tr').each(function(row, tr) { This means that we are going to iterate over all of the table rows in order to create a new object for each row.
        //We do this by calling function() on jQuery's .each() method which takes two arguments: row and tr (which stands for "table row").
        // Inside the parentheses you can see that we have passed these two arguments into another function called function().
        // This second function has been defined as follows: var TableData = []; Inside this definition there is an empty array called TableData.
        // Then inside of that definition there is a call to $('#tblProcessList tr').each(), which means that every time through our loop we will be passing in a reference to our current table element (tr) and its corresponding row number (0).
        // So when we run this code again later on after running it once more at line 8
        // The code is used to fetch the data from a table.
        // The first line of code creates an empty array, TableData.
        // Next, the next lines of code iterate through each row in the table and assigns values to the corresponding element in TableData.
        // The last line of code removes the header row from the table and then resets burst time for all rows in TableData back to 0.
        var i=0;
        function shortestRemainingTimeFirst() {
            var completedList = [];
            var time = 0;
            var queue = [];
            while (processList.length > 0 || queue.length > 0) {
                addToQueue();
                while (queue.length == 0) {
                    time++;
                    addToQueue();
                }
                selectProcessForSRTF();
                runSRTF();
            }

            function addToQueue() {
                for (var i = 0; i < processList.length; i++) {
                    if (processList[i].arrivalTime === time) {
                        var process = {
                            processID: processList[i].processID,
                            arrivalTime: processList[i].arrivalTime,
                            burstTime: processList[i].burstTime
                        }
                        processList.splice(i, 1);
                        queue.push(process);
                    }
                }
            }
            
            function selectProcessForSRTF() {
                if (queue.length != 0) {
                    queue.sort(function(a, b) {
                        if (a.burstTime > b.burstTime) {
                            return 1;
                        } else if (a.burstTime < b.burstTime) {
                            return -1;
                        }
                        else{
                            if(a.processID > b.processID){
                                return 1;
                            }
                            else{
                                return -1;
                            }
                        }
                    });
                    if(i === 0){
                        $('#ganttChart > tbody:last-child').append(
                            `
                                <td id="gtdBurstTime">${queue[0].arrivalTime}</td>
                            `
                        );
                    }
                    if (queue[0].burstTime == 1) {
                        process = queue.shift();
                        process.completedTime = time + 1;
                        completedList.push(process);
                        $('#ganttChart > tbody:last-child').append(
                            `
                                <td id="gtdProcessID">P${process.processID}</td>
                                <td id="gtdBurstTime">${process.completedTime}</td>
                            `
                        );

                    } else if (queue[0].burstTime > 1) {
                        process = queue[0];
                        queue[0].burstTime = process.burstTime - 1;
                        $('#ganttChart > tbody:last-child').append(
                            `
                                <td id="gtdProcessID">P${process.processID}</td>
                                <td id="gtdBurstTime">${time+1}</td>
                            `
                        );

                    }
                    i++;

                }
            }

            function runSRTF() {
                time++;
                addToQueue();
            }
            i=0;
            // Fetch table data
            var TableData = [];
            $('#tblProcessList tr').each(function(row, tr) {
                TableData[row] = {
                    "processID": parseInt($(tr).find('td:eq(0)').text()),
                    "arrivalTime": parseInt($(tr).find('td:eq(1)').text()),
                    "burstTime": parseInt($(tr).find('td:eq(2)').text())
                }
            });

            // Remove header row
            TableData.splice(0, 1);

            // Reset burst time
            TableData.forEach(pInTable => {
                completedList.forEach(pInCompleted => {
                    if (pInTable.processID == pInCompleted.processID) {
                        pInCompleted.burstTime = pInTable.burstTime;
                        pInCompleted.turnAroundTime = pInCompleted.completedTime - pInCompleted.arrivalTime;
                        pInCompleted.waitingTime = pInCompleted.turnAroundTime - pInCompleted.burstTime;
                    }
                });
            });

            // Bind table data
            $.each(completedList, function(key, process) {
                $('#tblResults > tbody:last-child').append(
                    `<tr>
                        <td id="tdProcessID">${process.processID}</td>
                        <td id="tdArrivalTime">${process.arrivalTime}</td>
                        <td id="tdBurstTime">${process.burstTime}</td>
                        <td id="tdBurstTime">${process.completedTime}</td>
                        <td id="tdBurstTime">${process.waitingTime}</td>
                        <td id="tdBurstTime">${process.turnAroundTime}</td>
                    </tr>`
                );
            });



            // Get average
            var avgTurnaroundTime = 0;
            var avgWaitingTime = 0;
            var maxCompletedTime = 0;
            var throughput = 0;

            $.each(completedList, function(key, process) {
                if (process.completedTime > maxCompletedTime) {
                    maxCompletedTime = process.completedTime;
                }
                avgTurnaroundTime = avgTurnaroundTime + process.turnAroundTime;
                avgWaitingTime = avgWaitingTime + process.waitingTime;
            });

            $('#avgTurnaroundTime').val(avgTurnaroundTime / completedList.length);
            $('#avgWaitingTime').val(avgWaitingTime / completedList.length);
            $('#throughput').val(completedList.length / maxCompletedTime);

            for(var index in originProcessList){
                processList[index] = originProcessList[index];
            }
        }
        i=0;
        function roundRobin() {
            var timeQuantum = $('#timeQuantum');
            var timeQuantumVal = parseInt(timeQuantum.val(), 10);
            if (timeQuantum.val() == '') {
                alert('Please enter time quantum');
                timeQuantum.addClass('is-invalid');
                return;
            }
            var completedList = [];
            var time = 0;
            var queue = [];

            while (processList.length > 0 || queue.length > 0) {
                addToQueue();
                while (queue.length == 0) {
                    time++;
                    addToQueue();
                }
                selectProcessForRR();
            }

            function addToQueue() {
                for (var i = 0; i < processList.length; i++) {
                    if (processList[i].arrivalTime === time) {
                        var process = {
                            processID: processList[i].processID,
                            arrivalTime: processList[i].arrivalTime,
                            burstTime: processList[i].burstTime
                        }
                        processList.splice(i, 1);
                        queue.push(process);
                    }
                }
            }
            function selectProcessForRR() {
                if (queue.length != 0) {
                    if(i === 0){
                        $('#ganttChart > tbody:last-child').append(
                            `
                                <td id="gtdBurstTime">${queue[0].arrivalTime}</td>
                            `
                        );
                    }
                    i++;
                    if (queue[0].burstTime < timeQuantumVal) {
                        process = queue.shift();
                        process.completedTime = time + process.burstTime;

                        for (var index = 0; index < process.burstTime; index++) {
                            time++;
                            addToQueue();
                        }
                        completedList.push(process);
                        $('#ganttChart > tbody:last-child').append(
                            `
                                <td id="gtdProcessID">P${process.processID}</td>
                                <td id="gtdBurstTime">${process.completedTime}</td>
                            `
                        );

                    } else if (queue[0].burstTime == timeQuantumVal) {
                        process = queue.shift();
                        process.completedTime = time + timeQuantumVal;
                        completedList.push(process);
                        $('#ganttChart > tbody:last-child').append(
                            `
                                <td id="gtdProcessID">P${process.processID}</td>
                                <td id="gtdBurstTime">${process.completedTime}</td>
                            `
                        );
                        for (var index = 0; index < timeQuantumVal; index++) {
                            time++;
                            addToQueue();
                        }
                    } else if (queue[0].burstTime > timeQuantumVal) {
                        process = queue[0];
                        queue[0].burstTime = process.burstTime - timeQuantumVal;
                        $('#ganttChart > tbody:last-child').append(
                            `
                                <td id="gtdProcessID">P${process.processID}</td>
                                <td id="gtdBurstTime">${time + timeQuantumVal}</td>
                            `
                        );
                        for (var index = 0; index < timeQuantumVal; index++) {
                            time++;
                            addToQueue();
                        }
                        process = queue.shift();
                        queue.push(process);
                       
                    }
                }
               
            }
            i=0;
            // Fetch initial table data
            var TableData = [];
            $('#tblProcessList tr').each(function(row, tr) {
                TableData[row] = {
                    "processID": parseInt($(tr).find('td:eq(0)').text()),
                    "arrivalTime": parseInt($(tr).find('td:eq(1)').text()),
                    "burstTime": parseInt($(tr).find('td:eq(2)').text())
                }
            });

            // Remove table header row
            TableData.splice(0, 1);

            // Reset burst time from original input table.
          
            TableData.forEach(pInTable => {
                completedList.forEach(pInCompleted => {
                    if (pInTable.processID == pInCompleted.processID) {
                        pInCompleted.burstTime = pInTable.burstTime;
                        pInCompleted.turnAroundTime = pInCompleted.completedTime - pInCompleted.arrivalTime;
                        pInCompleted.waitingTime = pInCompleted.turnAroundTime - pInCompleted.burstTime;
                    }
                    
                });
                
            });

            // Bind table data
            $.each(completedList, function(key, process) {
                $('#tblResults > tbody:last-child').append(
                    `<tr>
                        <td id="tdProcessID">${process.processID}</td>
                        <td id="tdArrivalTime">${process.arrivalTime}</td>
                        <td id="tdBurstTime">${process.burstTime}</td>
                        <td id="tdBurstTime">${process.completedTime}</td>
                        <td id="tdBurstTime">${process.waitingTime}</td>
                        <td id="tdBurstTime">${process.turnAroundTime}</td>
                    </tr>`
                );
               
            });
            
           
           

            // Get average
            var totalTurnaroundTime = 0;
            var totalWaitingTime = 0;
            var maxCompletedTime = 0;

            $.each(completedList, function(key, process) {
                if (process.completedTime > maxCompletedTime) {
                    maxCompletedTime = process.completedTime;
                }
                totalTurnaroundTime = totalTurnaroundTime + process.turnAroundTime;
                totalWaitingTime = totalWaitingTime + process.waitingTime;
            });

            $('#avgTurnaroundTime').val(totalTurnaroundTime / completedList.length);
            $('#avgWaitingTime').val(totalWaitingTime / completedList.length);
            $('#throughput').val(completedList.length / maxCompletedTime);

            for(var index in originProcessList){
                processList[index] = originProcessList[index];
            }
        }
        
    }
);