export const refactorPrefilledDate=(date)=>{
    const updateddate = new Date(date);
   
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).format(updateddate);
    return formattedDate;
}

