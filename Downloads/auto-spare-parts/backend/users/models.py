from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django_countries.fields import CountryField
from phonenumber_field.modelfields import PhoneNumberField

class UserManager(BaseUserManager):
    """Define a model manager for User model."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Custom User model with email as the unique identifier."""
    username = None
    email = models.EmailField(_('email address'), unique=True)
    name = models.CharField(_('full name'), max_length=150, blank=True)
    phone = PhoneNumberField(_('phone number'), blank=True)
    
    # Additional fields
    address = models.TextField(_('address'), blank=True)
    city = models.CharField(_('city'), max_length=100, blank=True)
    country = CountryField(_('country'), blank=True)
    
    # Preferences
    language = models.CharField(_('preferred language'), max_length=10, choices=[
        ('en', 'English'),
        ('ar', 'Arabic')
    ], default='en')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(_('last login'), blank=True, null=True)
    
    # Email verification
    email_verified = models.BooleanField(_('email verified'), default=False)
    email_verification_token = models.CharField(_('email verification token'), max_length=100, blank=True)
    
    # Password reset
    password_reset_token = models.CharField(_('password reset token'), max_length=100, blank=True)
    password_reset_token_created_at = models.DateTimeField(_('password reset token created at'), blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-date_joined']

class UserAddress(models.Model):
    """Model for storing multiple addresses for a user."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    address_type = models.CharField(_('address type'), max_length=20, choices=[
        ('home', 'Home'),
        ('work', 'Work'),
        ('other', 'Other')
    ])
    address = models.TextField(_('address'))
    city = models.CharField(_('city'), max_length=100)
    country = CountryField(_('country'))
    postal_code = models.CharField(_('postal code'), max_length=20)
    is_default = models.BooleanField(_('is default'), default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('user address')
        verbose_name_plural = _('user addresses')
        ordering = ['-is_default', '-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.address_type}"

    def save(self, *args, **kwargs):
        if self.is_default:
            # Set all other addresses of this user to non-default
            UserAddress.objects.filter(user=self.user).exclude(id=self.id).update(is_default=False)
        super().save(*args, **kwargs)
