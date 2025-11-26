import 'package:flutter/material.dart';

import '../services/navigation_service.dart';

class BreadcrumbBar extends StatelessWidget {
  const BreadcrumbBar({
    super.key,
    required this.breadcrumbs,
    this.onTap,
  });

  final List<Breadcrumb> breadcrumbs;
  final ValueChanged<Breadcrumb>? onTap;

  @override
  Widget build(BuildContext context) {
    if (breadcrumbs.isEmpty) return const SizedBox.shrink();

    return Wrap(
      spacing: 8,
      runSpacing: 4,
      children: breadcrumbs.map((crumb) {
        final isLast = crumb == breadcrumbs.last;
        final color = isLast ? Colors.teal.shade700 : Colors.teal;

        return GestureDetector(
          onTap: isLast ? null : () => onTap?.call(crumb),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: isLast ? color.withOpacity(0.1) : Colors.grey.shade100,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: color),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.chevron_right, size: 16, color: color),
                const SizedBox(width: 4),
                Text(
                  crumb.label,
                  style: TextStyle(
                    color: color,
                    fontWeight: isLast ? FontWeight.bold : FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}
