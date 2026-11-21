/** Google accepting a send is distinct from confirmed inbox delivery. */
function ffSendPreparedApprovalRequests_(messages) {
  if (!Array.isArray(messages) || !messages.length) throw new Error('No approval messages were prepared. Approval was not sent.');
  var failed = 0;
  messages.forEach(function(message) {
    try { MailApp.sendEmail(message.to, message.subject, message.body, {htmlBody:message.htmlBody,name:'FormFlow'}); }
    catch (error) { failed++; }
  });
  if (failed) throw new Error('Approval email delivery could not be confirmed for '+failed+' of '+messages.length+' recipient(s). Check the approval record and recipients before retrying; some messages may already have been sent.');
  return {accepted:messages.length};
}
