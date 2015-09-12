$(document).ready(function(){
	$('#loginForm').on('submit', function(e) {
        e.preventDefault();
        var email = $('#inputEmail').val();
        var pwd = $('#inputPassword').val();

        var errorInfo = '';

        if(!validateEmail(email))
        	errorInfo += 'Email format is wrong.<br/>';

        if(!validatePwd(pwd))
        	errorInfo += 'Password is not complicated enough.<br/>';

        if(errorInfo != '')
        	showError(errorInfo);
        else{
        	$.ajax({
        		url : 'handlerLogin',
        		type : 'post',
        		data : {email : email, pwd: pwd},
        		success : function(response, textStatus){
        			var obj = JSON.parse(response);
        			if(obj.status == 'success'){
						/*Store user data locally*/
						if ('localStorage' in window && window['localStorage'] !== null) {
							try {
								localStorage.setItem('token', obj.token);
								alert('Token: ' + localStorage.token + ' Stored in HTML5 localStorage');
							} catch (e) {
								alert('HTML5 localStorage failure');
							}
						} else {
							alert('Cannot store user preferences as your browser do not support local storage');
						}
						window.location.href = 'welcome.html';
        			}
        			else{
        				showError(obj.status);
        			}
        		},
        		error : function(response, textStatus){
        			showError('Fail to submit data to the server.')
        		}
        	});
        }
    });
});

function validateEmail(email){
	var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
    return pattern.test(email);
}

function validatePwd(pwd){
	//not less than 11 characters, a mix of upcase, lowcase and numbers 
	var pattern=new RegExp(/^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{11,}$/);  
	return pattern.test(pwd); 
}

function showError(errStr){
    $('#errorDiv').html(errStr);
	$('#errorDiv').css('z-index', 100);
    $('#errorDiv').stop().fadeIn(400).delay(3000).fadeOut(400);
}
