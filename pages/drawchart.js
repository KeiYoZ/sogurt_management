$( document ).ready(function() {
  
  $.getJSON('http://localhost:8080/data.json', function(json) {
      
    Morris.Bar({
      element: 'claim_vs_redeem',
      data: json,
      xkey: 'date',
      ykeys: ['claimed', 'redeemed'],
      labels: ['Claimed', 'Redeemed']
    });
  });

});