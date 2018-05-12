<?php
  $errors         = array();      // array to hold validation errors
  $data           = array();      // array to pass back data
  $sucessMessage  = "";
  // validate the variables ======================================================
  // if any of these variables don't exist, add an error to our $errors array
  if (empty($_POST['name']))
      $errors['name'] = 'Name is required.';
  if (empty($_POST['email']))
      $errors['email'] = 'Email is required.';
  if (empty($_POST['phone']))
      $errors['content'] = 'Phone is required.';

  $sucessMessage = "Ваша заявка успешно отправлена. Мы свяжемся с вами для подтверждения в ближайшее время";

  // return a response ===========================================================
  // if there are any errors in our errors array, return a success boolean of false
  if ( ! empty($errors)) {
    // if there are items in our errors array, return those errors
    $data['success'] = false;
    $data['errors']  = $errors;
  } else {
    $email_to = 'xs290@me.com, info@taiko.moscow';
    $email_subject = "Форма звонка :: TAIKO ";
    $email_message = "Новая заявка\n\n";
    function clean_string($string) {
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }
    $email_message .= "Имя: ".clean_string($_POST['name'])."\n";
    $email_message .= "Почта: ".clean_string($_POST['email'])."\n";
    $email_message .= "Телефон: ".clean_string($_POST['phone'])."\n";
    $email_message .= "Программа: ".clean_string($_POST['programm'])."\n";
    $email_message .= "Количество человек: ".clean_string($_POST['people'])."\n";
    @mail($email_to, $email_subject, $email_message);
    // show a message of success and provide a true success variable
    $data['success'] = true;
    $data['message'] = $sucessMessage;
  }
  // return all our data to an AJAX call
  echo json_encode($data);
