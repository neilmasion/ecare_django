from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('core', '0002_remove_service_icon_service_badge_service_badge_type_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='AssistanceRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(max_length=30)),
                ('address', models.TextField(blank=True)),
                ('assistance_type', models.CharField(max_length=100)),
                ('urgency', models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('emergency', 'Emergency')], default='medium', max_length=20)),
                ('description', models.TextField()),
                ('reference_number', models.CharField(blank=True, max_length=20, unique=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('in_review', 'In Review'), ('approved', 'Approved'), ('resolved', 'Resolved'), ('rejected', 'Rejected')], default='pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='ContactSubmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(blank=True, max_length=30)),
                ('message', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('is_resolved', models.BooleanField(default=False)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.AlterModelOptions(
            name='service',
            options={'ordering': ['order', 'title']},
        ),
        migrations.AlterField(
            model_name='service',
            name='badge_type',
            field=models.CharField(blank=True, choices=[('prime', 'Prime'), ('urgent', 'Urgent'), ('', 'None')], max_length=20),
        ),
        migrations.AlterField(
            model_name='service',
            name='category',
            field=models.CharField(choices=[('documents', 'Documents'), ('appointments', 'Appointments'), ('emergency', 'Emergency'), ('community', 'Community'), ('volunteer', 'Volunteer'), ('health', 'Health')], max_length=50),
        ),
        migrations.AlterField(
            model_name='service',
            name='features',
            field=models.JSONField(default=list),
        ),
        migrations.AlterField(
            model_name='service',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='services/'),
        ),
        migrations.AlterField(
            model_name='service',
            name='order',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='service',
            name='price',
            field=models.CharField(default='Free', max_length=50),
        ),
        migrations.AlterField(
            model_name='service',
            name='processing_time',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='service',
            name='rating',
            field=models.DecimalField(decimal_places=1, default=5.0, max_digits=3),
        ),
        migrations.AlterField(
            model_name='service',
            name='requirements',
            field=models.JSONField(default=list),
        ),
        migrations.AlterField(
            model_name='service',
            name='stat_label1',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='service',
            name='stat_label2',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='service',
            name='stat_label3',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='service',
            name='stat_value1',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='service',
            name='stat_value2',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='service',
            name='stat_value3',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='service',
            name='title',
            field=models.CharField(max_length=200),
        ),
    ]