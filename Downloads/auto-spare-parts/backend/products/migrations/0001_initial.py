# Generated by Django 4.2.7 on 2025-05-06 12:04

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import parler.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Brand',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Name')),
                ('slug', models.SlugField(max_length=100, unique=True, verbose_name='Slug')),
                ('logo', models.ImageField(blank=True, null=True, upload_to='brands/', verbose_name='Logo')),
                ('description', models.TextField(blank=True, verbose_name='Description')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Brand',
                'verbose_name_plural': 'Brands',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=100, unique=True, verbose_name='Slug')),
                ('image', models.ImageField(blank=True, null=True, upload_to='categories/', verbose_name='Image')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('order', models.PositiveIntegerField(default=0, verbose_name='Order')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('lft', models.PositiveIntegerField(editable=False)),
                ('rght', models.PositiveIntegerField(editable=False)),
                ('tree_id', models.PositiveIntegerField(db_index=True, editable=False)),
                ('level', models.PositiveIntegerField(editable=False)),
            ],
            options={
                'verbose_name': 'Category',
                'verbose_name_plural': 'Categories',
                'ordering': ['order', 'translations__name'],
            },
            bases=(parler.models.TranslatableModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name='CategoryTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('language_code', models.CharField(db_index=True, max_length=15, verbose_name='Language')),
                ('name', models.CharField(max_length=100, verbose_name='Name')),
                ('description', models.TextField(blank=True, verbose_name='Description')),
                ('meta_title', models.CharField(blank=True, max_length=100, verbose_name='Meta Title')),
                ('meta_description', models.TextField(blank=True, verbose_name='Meta Description')),
            ],
            options={
                'verbose_name': 'Category Translation',
                'db_table': 'products_category_translation',
                'db_tablespace': '',
                'managed': True,
                'default_permissions': (),
            },
            bases=(parler.models.TranslatedFieldsModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Price')),
                ('compare_at_price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='Compare at Price')),
                ('stock', models.PositiveIntegerField(default=0, verbose_name='Stock')),
                ('sku', models.CharField(max_length=50, unique=True, verbose_name='SKU')),
                ('barcode', models.CharField(blank=True, max_length=50, verbose_name='Barcode')),
                ('image', models.ImageField(upload_to='products/', verbose_name='Main Image')),
                ('is_featured', models.BooleanField(default=False, verbose_name='Featured')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('rating', models.DecimalField(decimal_places=2, default=0.0, max_digits=3, verbose_name='Rating')),
                ('review_count', models.PositiveIntegerField(default=0, verbose_name='Review Count')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Product',
                'verbose_name_plural': 'Products',
                'ordering': ['-created_at'],
            },
            bases=(parler.models.TranslatableModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name='ProductImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='products/', verbose_name='Image')),
                ('alt_text', models.CharField(blank=True, max_length=200, verbose_name='Alt text')),
                ('order', models.PositiveSmallIntegerField(default=0, verbose_name='Order')),
            ],
            options={
                'verbose_name': 'Product Image',
                'verbose_name_plural': 'Product Images',
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='ProductTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('language_code', models.CharField(db_index=True, max_length=15, verbose_name='Language')),
                ('name', models.CharField(max_length=200, verbose_name='Name')),
                ('description', models.TextField(blank=True, verbose_name='Description')),
                ('specs', models.JSONField(blank=True, default=dict, verbose_name='Specifications')),
                ('meta_title', models.CharField(blank=True, max_length=100, verbose_name='Meta Title')),
                ('meta_description', models.TextField(blank=True, verbose_name='Meta Description')),
            ],
            options={
                'verbose_name': 'Product Translation',
                'db_table': 'products_product_translation',
                'db_tablespace': '',
                'managed': True,
                'default_permissions': (),
            },
            bases=(parler.models.TranslatedFieldsModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name='ProductVariant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Name')),
                ('sku', models.CharField(max_length=50, unique=True, verbose_name='SKU')),
                ('price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='Price')),
                ('stock', models.PositiveIntegerField(default=0, verbose_name='Stock')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Product Variant',
                'verbose_name_plural': 'Product Variants',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.PositiveSmallIntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)], verbose_name='Rating')),
                ('title', models.CharField(max_length=200, verbose_name='Title')),
                ('comment', models.TextField(verbose_name='Comment')),
                ('is_approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='products.product')),
            ],
            options={
                'verbose_name': 'Review',
                'verbose_name_plural': 'Reviews',
                'ordering': ['-created_at'],
            },
        ),
    ]
