from django.db import models

class Patient(models.Model):
    FName = models.CharField(max_length=100)
    PatID = models.IntegerField(unique=True)
    MName = models.CharField(max_length=100)
    SName = models.CharField(max_length=100)
    Age = models.FloatField()
    DOB = models.DateTimeField()
    city = models.CharField(max_length=100)
    Category = models.CharField(max_length=50)
    
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (
            f"name: {self.FName} {self.MName} {self.SName}, age: {self.Age}, "
            f"city: {self.city}, Category: {self.Category}, PatID: {self.PatID}, created_at: {self.created_at}"
        )


