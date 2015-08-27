function getChartData(dateArgs, voucherArgs){
	
	$("#claim_vs_redeem").html("");
	$("#ageChart").html("");
	$("#genderChart").html("");
	//localStorage.clear();

	if (typeof voucherArgs === 'undefined'){ 
	
		voucherArgs = 'default';
		
	}

	var VoucherRedeem = Parse.Object.extend("VoucherRedeem");
	var Voucher = Parse.Object.extend("Voucher");
	var User = Parse.Object.extend("User");
	var voucherRedeem = new VoucherRedeem();
	var user = new User();
	var merchant = new Merchant();
	var voucher = new Voucher();

	var todayTemp = new Date();
	var today = new Date(todayTemp.setHours(0,0,0,0));
	var nextDay = new Date(todayTemp.setDate(todayTemp.getDate()+1));
	
	var date_today = parseToday(today);
	var finalClaim = 0;
	var finalRedeem = 0;
	
	var redeemVsClaimData = [];
	
	var lastWeek = [];
	var monthStore = [];
	var iteration = 0;
	
	if (dateArgs == "last seven"){
		iteration = 7;
		
		for (var i = 0; i < iteration; i++)
		{
			var dayStore = new Date();
			var tempDay = new Date(dayStore.setDate(dayStore.getDate()-i));
			var tempDay = new Date(tempDay.setHours(0,0,0,0));
			lastWeek.push(tempDay);
		}
		//console.log(lastWeek)
	}
	else if (dateArgs == "year"){
		iteration = 2;
	}
	

	var claimCount = 0;
	var redeemCount = 0;
	
	var userIds = [];
	
	
	if (dateArgs == "today"){
	
		var allQuery = new Parse.Query(VoucherRedeem);
		if (voucherArgs != "default"){
			allQuery.equalTo("voucher", {
								__type: "Pointer",
								className: "Voucher",
								objectId: voucherArgs
							});
		}
		allQuery.find({
			success: function(results) {
				for (var i = 0; i < results.length; i++) {
				
					var object = results[i];
					var createdDate = new Date(object.createdAt);
					
					if ((createdDate >= today) && (createdDate < nextDay)){
					
						var isRedeemed = object.get("isRedeem");
						var isClaimed = object.get("isClaim");
						
						if (isRedeemed == true){
							redeemCount++;
						}
						
						if (isClaimed == true){
							claimCount++;
						}
						
						if ((isRedeemed == true) && (isClaimed == true)){
							
							var user = object.get("user");
							var userId = user.id;
							
							if (userIds.indexOf(userId) == -1){
								userIds.push(userId);
							}
						}
						
						finalRedeem = redeemCount;
						finalClaim = claimCount;
						
					}
				}
				
				var dataTemp = {
					"date":date_today,
					"redeemed":finalRedeem,
					"claimed":finalClaim
				};
				
				redeemVsClaimData.push(dataTemp);
				
				localStorage.setItem('redeem_vs_claim', JSON.stringify(redeemVsClaimData));
				
				getAgeAndGender(userIds);
				
				//generateChart();
			},
			error: function(error) {
				alert("Error: " + error.code + " " + error.message);
			}
		});
	}
	else if (dateArgs == "last seven"){
	
		var allQuery = new Parse.Query(VoucherRedeem);
		if (voucherArgs != "default"){
			allQuery.equalTo("voucher", {
								__type: "Pointer",
								className: "Voucher",
								objectId: voucherArgs
							});
		}
		allQuery.find({
			success: function(results) {
				for (var i = 0; i < lastWeek.length; i++) {
				
					finalClaim = 0;
					finalRedeem = 0;
					//console.log("current date: " + lastWeek[i]);
					
					for (var j = 0; j < results.length; j++){
					
						var object = results[j];
						var createdDate = new Date(object.createdAt);
						
						claimCount = 0;
						redeemCount = 0;
						
						if (i == 0){
							if ((createdDate >= lastWeek[i]) && (createdDate < nextDay)){
							
								var isRedeemed = object.get("isRedeem");
								var isClaimed = object.get("isClaim");
								
								if (isRedeemed == true){
									redeemCount++;
								}
								
								if (isClaimed == true){
									claimCount++;
								}
								
								if ((isRedeemed == true) && (isClaimed == true)){
									
									var user = object.get("user");
									var userId = user.id;
									
									userIds.push(userId);
								}
							}
						}
						else{
							
							if ((createdDate >= lastWeek[i]) && (createdDate < lastWeek[i-1])){
							
								var isRedeemed = object.get("isRedeem");
								var isClaimed = object.get("isClaim");
								
								if (isRedeemed == true){
									redeemCount++;
								}
								
								if (isClaimed == true){
									claimCount++;
								}
								
								if ((isRedeemed == true) && (isClaimed == true)){
									
									var user = object.get("user");
									var userId = user.id;
									
									if (userIds.indexOf(userId) == -1){
										userIds.push(userId);
									}
								}
							}
						}
						
						finalRedeem += redeemCount;
						finalClaim += claimCount;
						//console.log(finalRedeem);
						//console.log(finalClaim);
					}
					
					var date_today = parseToday(lastWeek[i]);
						
					var dataTemp = {
						"date":date_today,
						"redeemed":finalRedeem,
						"claimed":finalClaim
					};
					
					redeemVsClaimData.push(dataTemp);
				}
				
				//console.log(redeemVsClaimData);
				localStorage.setItem('redeem_vs_claim', JSON.stringify(redeemVsClaimData));
				
				getAgeAndGender(userIds);
				
				//generateChart();
			},
			error: function(error) {
				alert("Error: " + error.code + " " + error.message);
			}
		});
	
	}
	else if (dateArgs.indexOf("month") > -1){
	//else if (dateArgs == "month"){
		
		var currentMonth = todayTemp.getMonth()+1;
		
		if (dateArgs == "month-jan"){
			currentMonth = 1;
		}
		else if (dateArgs == "month-feb"){
			currentMonth = 2;
		}
		else if (dateArgs == "month-mar"){
			currentMonth = 3;
		}
		else if (dateArgs == "month-apr"){
			currentMonth = 4;
		}
		else if (dateArgs == "month-may"){
			currentMonth = 5;
		}
		else if (dateArgs == "month-jun"){
			currentMonth = 6;
		}
		else if (dateArgs == "month-jul"){
			currentMonth = 7;
		}
		else if (dateArgs == "month-aug"){
			currentMonth = 8;
		}
		else if (dateArgs == "month-sep"){
			currentMonth = 9;
		}
		else if (dateArgs == "month-oct"){
			currentMonth = 10;
		}
		else if (dateArgs == "month-nov"){
			currentMonth = 11;
		}
		else if (dateArgs == "month-dec"){
			currentMonth = 12;
		}
		
		var allQuery = new Parse.Query(VoucherRedeem);
		if (voucherArgs != "default"){
			allQuery.equalTo("voucher", {
								__type: "Pointer",
								className: "Voucher",
								objectId: voucherArgs
							});
		}
		allQuery.find({
			success: function(results) {
				
				if (dateArgs == "month"){
					for (var i = 1; i <= currentMonth; i++){
					
						finalClaim = 0;
						finalRedeem = 0;
						
						for (var j = 0; j < results.length; j++){
						
							var object = results[j];
							var createdDate = new Date(object.createdAt);
							var createdMonth = createdDate.getMonth()+1;
							
							claimCount = 0;
							redeemCount = 0;
							
							if (i == createdMonth){
							
								var isRedeemed = object.get("isRedeem");
								var isClaimed = object.get("isClaim");
								
								if (isRedeemed == true){
									redeemCount++;
								}
								
								if (isClaimed == true){
									claimCount++;
								}
								
								if ((isRedeemed == true) && (isClaimed == true)){
									
									var user = object.get("user");
									var userId = user.id;
									
									if (userIds.indexOf(userId) == -1){
										userIds.push(userId);
									}
								}
							}
							
							finalRedeem += redeemCount;
							finalClaim += claimCount;
							//console.log(finalRedeem);
							//console.log(finalClaim);
						}
						
						//var date_today = parseToday(lastWeek[i]);
						var monthTemp = parseMonth(i);
						
						var dataTemp = {
							"date":monthTemp,
							"redeemed":finalRedeem,
							"claimed":finalClaim
						};
						
						redeemVsClaimData.push(dataTemp);
					}
				}
				else{
					for(var j = 0; j < results.length; j++){
						
						var object = results[j];
						var createdDate = new Date(object.createdAt);
						var createdMonth = createdDate.getMonth()+1;
						
						claimCount = 0;
						redeemCount = 0;
						
						if (currentMonth == createdMonth){
						
							var isRedeemed = object.get("isRedeem");
							var isClaimed = object.get("isClaim");
							
							if (isRedeemed == true){
								redeemCount++;
							}
							
							if (isClaimed == true){
								claimCount++;
							}
							
							if ((isRedeemed == true) && (isClaimed == true)){
								
								var user = object.get("user");
								var userId = user.id;
								
								if (userIds.indexOf(userId) == -1){
									userIds.push(userId);
								}
							}
						}
						
						finalRedeem += redeemCount;
						finalClaim += claimCount;
						//console.log(finalRedeem);
						//console.log(finalClaim);
					}
					
					var monthTemp = parseMonth(currentMonth);
						
					var dataTemp = {
						"date":monthTemp,
						"redeemed":finalRedeem,
						"claimed":finalClaim
					};
					
					redeemVsClaimData.push(dataTemp);
				}
				
				//console.log(redeemVsClaimData);
				localStorage.setItem('redeem_vs_claim', JSON.stringify(redeemVsClaimData));
				
				getAgeAndGender(userIds);
				
				//generateChart();
				
			},
			error: function(error) {
				alert("Error: " + error.code + " " + error.message);
			}
		});
	}
	else if (dateArgs.indexOf("year") > -1){
		
		var currentYear = todayTemp.getFullYear();
		
		if (dateArgs.indexOf("-") > -1){
			
			var yearParams = dateArgs.split("-");
			currentYear = yearParams[1];
		}
		
		//console.log(currentYear);
		
		var allQuery = new Parse.Query(VoucherRedeem);
		if (voucherArgs != "default"){
			allQuery.equalTo("voucher", {
								__type: "Pointer",
								className: "Voucher",
								objectId: voucherArgs
							});
		}
		allQuery.find({
			success: function(results) {
				finalClaim = 0;
				finalRedeem = 0;
				//console.log("current date: " + lastWeek[i]);
				
				for (var i = 0; i < results.length; i++){
				
					var object = results[i];
					var createdDate = new Date(object.createdAt);
					var createdYear = createdDate.getFullYear();
					
					claimCount = 0;
					redeemCount = 0;
					
					if (createdYear == currentYear){
					
						var isRedeemed = object.get("isRedeem");
						var isClaimed = object.get("isClaim");
						
						if (isRedeemed == true){
							redeemCount++;
						}
						
						if (isClaimed == true){
							claimCount++;
						}
						
						if ((isRedeemed == true) && (isClaimed == true)){
							
							var user = object.get("user");
							var userId = user.id;
							
							if (userIds.indexOf(userId) == -1){
								userIds.push(userId);
							}
						}
					}
					
					finalRedeem += redeemCount;
					finalClaim += claimCount;
					//console.log(finalRedeem);
					//console.log(finalClaim);
				}
				
				//var date_today = parseToday(lastWeek[i]);
				//var monthTemp = parseMonth(i);
				
				var dataTemp = {
					"date":currentYear,
					"redeemed":finalRedeem,
					"claimed":finalClaim
				};
				
				redeemVsClaimData.push(dataTemp);
				
				//console.log(redeemVsClaimData);
				localStorage.setItem('redeem_vs_claim', JSON.stringify(redeemVsClaimData));
				
				getAgeAndGender(userIds);
				
				//generateChart();
				
			},
			error: function(error) {
				alert("Error: " + error.code + " " + error.message);
			}
		});
	}
	//generateChart();
}

function getAgeAndGender(userIdCollection){

	var User = Parse.Object.extend("User");
	
	var userIds = userIdCollection;

	var lessTwentys = 0;
	var twentys = 0;
	var thirtys = 0;
	var fortys = 0;
	var fiftys = 0;
	var greaterSixtys = 0;
	
	var noAge = false;
	var noGender = false;
	
	var maleCtr = 0;
	var femaleCtr = 0;
	
	var ageStore = []
	var genderStore = [];
	
	var totalAge = 0;
	var totalGender = 0;
	
	var userQuery = new Parse.Query(User);
	userQuery.find({
		success: function(results) {
		
			for (var x = 0; x < results.length; x++){
				
				var userObject = results[x];
				var userObjectId = userObject.id;
				
				for (var y = 0; y < userIds.length; y++){
					
					if (userIds[y] == userObjectId){
						
						var userAge = userObject.get("age");
						var userGender = userObject.get("genderTest");
						
						//console.log(userObjectId);
						
						//age switch
						if (userAge < 20){
						
							lessTwentys++;
							totalAge++;
							//console.log(lessTwentys);
							
						}else if ((userAge >= 20) && (userAge <=29)){
						
							twentys++;
							totalAge++;
							//console.log(twentys);
							
						}else if ((userAge >= 30) && (userAge <=39)){
							
							thirtys++;
							totalAge++;
							//console.log(thirtys);
							
						}else if ((userAge >= 40) && (userAge <=49)){
							
							fortys++;
							totalAge++;
							//console.log(fortys);
							
						}else if ((userAge >= 50) && (userAge <=59)){
							
							fiftys++;
							totalAge++;
							//console.log(fiftys);
							
						}else if (userAge >= 60){
							
							greaterSixtys++;
							totalAge++;
							//console.log(greaterSixtys);
						}
						
						//gender switch
						if (userGender == "male"){
						
							maleCtr++;
							totalGender++;
							//console.log(maleCtr);
						
						}else if (userGender == "female"){
						
							femaleCtr++;
							totalGender++;
							//console.log(femaleCtr);
						}
					}
				}
			}
			
			if (totalAge == 0)
			{
				noAge = true;
			}
			
			if (totalGender == 0)
			{
				noGender = true;
			}
			
			//console.log(noAge);
			//console.log(noGender);
			
			document.getElementById("total_age").innerHTML = "Total Users: " + totalAge;
			document.getElementById("total_gender").innerHTML = "Total Users: " + totalGender;
			
			if (noAge == false){
				var lessTwentysStore = {
					label:"Age:<20",
					value:lessTwentys
				};
				
				ageStore.push(lessTwentysStore);
				
				var twentysStore = {
					label:"Age:20-29",
					value:twentys
				};
				
				ageStore.push(twentysStore);
				
				var thirtysStore = {
					label:"Age:30-39",
					value:thirtys
				};
				
				ageStore.push(thirtysStore);
				
				var fortysStore = {
					label:"Age:40-49",
					value:fortys
				};
				
				ageStore.push(fortysStore);
				
				var fiftysStore = {
					label:"Age:50-59",
					value:lessTwentys
				};
				
				ageStore.push(fiftysStore);
				
				var greaterSixtysStore = {
					label:"Age:>60",
					value:greaterSixtys
				};
				
				ageStore.push(greaterSixtysStore);
			}
			else{
				var noNew = {
					label:"No New User",
					value:0
				};
				
				ageStore.push(noNew);
			}
			
			//console.log(ageStore);
			localStorage.setItem('age', "");
			localStorage.setItem('age', JSON.stringify(ageStore));
			
			//gender
			if (noGender == false){
				var maleStore = {
					label:"male",
					value:maleCtr
				};
				
				var femaleStore = {
					label:"female",
					value:femaleCtr
				};
			
				genderStore.push(maleStore);
				genderStore.push(femaleStore);
			}else{
				var noNew = {
					label:"No New User",
					value:0
				};
				
				genderStore.push(noNew);
			}
			
			//console.log(genderStore);
			localStorage.setItem('gender', "");
			localStorage.setItem('gender', JSON.stringify(genderStore));
			
			generateChart();
			
		}
	});
}

function generateChart(){
	
	var redeemVsClaimData = JSON.parse(localStorage.getItem('redeem_vs_claim'));
	var ageData = JSON.parse(localStorage.getItem('age'));
	var genderData = JSON.parse(localStorage.getItem('gender'));
	
	//console.log(ageData);
	//console.log(genderData);
	
	Morris.Bar({
		element: 'claim_vs_redeem',
		data: redeemVsClaimData,
		xkey: 'date',
		ykeys: ['claimed', 'redeemed'],
		labels: ['Claimed', 'Redeemed'],
		hideHover: 'auto',
		resize: true
	});

	Morris.Donut({
	  element: 'ageChart',
	  data: ageData
	});

	Morris.Donut({
	  element: 'genderChart',
	  data:genderData
	});
}

function parseToday(today){
	//var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
		dd='0'+dd;
	} 

	if(mm<10) {
		mm='0'+mm;
	} 

	today = mm+'-'+dd+'-'+yyyy;
	return today;
}

function getNextDay(today){
	
	var date_now = parseToday(today);
	var date = date_now.split('-');
	var day = parseInt(date[1]);
	date[1] = day + 1;
	
	if(date[1]<10) {
		date[1]='0'+date[1];
	} 
	
	var nextDay = date.join('-');
	return nextDay;
	
}

function parseMonth(monthInt){

	var monthTemp = ""

	if (monthInt == 1){
		monthTemp = "Jan";
	}
	else if (monthInt == 2){
		monthTemp = "Feb";
	}
	else if (monthInt == 3){
		monthTemp = "Mar";
	}
	else if (monthInt == 4){
		monthTemp = "Apr";
	}
	else if (monthInt == 5){
		monthTemp = "May";
	}
	else if (monthInt == 6){
		monthTemp = "Jun";
	}
	else if (monthInt == 7){
		monthTemp = "Jul";
	}
	else if (monthInt == 8){
		monthTemp = "Aug";
	}
	else if (monthInt == 9){
		monthTemp = "Sep";
	}
	else if (monthInt == 10){
		monthTemp = "Oct";
	}
	else if (monthInt == 11){
		monthTemp = "Nov";
	}
	else if (monthInt == 12){
		monthTemp = "Dec";
	}
	
	return monthTemp;
	
}
